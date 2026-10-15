// ══════════════════════════════════════════════════
// ADMIN ORDERS MANAGEMENT (Using API instead of localStorage)
// NOTE: escapeHtml is loaded from js/security.js
// ══════════════════════════════════════════════════

let ordersCache = [];
let ordersStats = {
  totalOrders: 0,
  totalSales: 0,
  todayOrders: 0,
  todaySales: 0,
  monthOrders: 0,
  monthSales: 0
};

// Refresh control
let isLoadingOrders = false;
let ordersRefreshTimer = null;
let lastOrdersLoadTime = 0;

// Map API status to Arabic display status
const STATUS_MAP = {
  'pending': 'جديد ⏳',
  'confirmed': 'تم التأكيد هاتفياً 📞',
  'shipped': 'قيد التجهيز والشحن 🚚',
  'delivered': 'تم التسليم بنجاح ✅',
  'cancelled': 'تم الإلغاء ❌'
};

const STATUS_REVERSE_MAP = {
  'جديد ⏳': 'pending',
  'تم التأكيد هاتفياً 📞': 'confirmed',
  'قيد التجهيز والشحن 🚚': 'shipped',
  'تم التسليم بنجاح ✅': 'delivered',
  'تم الإلغاء ❌': 'cancelled'
};

const PAYMENT_MAP = {
  'cod': '💵 كاش عند الاستلام',
  'instapay': '⚡ إنستاباي (InstaPay)',
  'voda': '📱 محفظة فودافون كاش'
};

// Show error in table area
function showErrorInTable(message) {
  const tbody = document.getElementById('allOrdersTable');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 48px 20px; color: var(--text-light);">
          <div style="font-size: 2.5rem; margin-bottom: 12px; color: #D32F2F;">⚠️</div>
          <strong style="color: var(--text-dark);">${message}</strong>
          <div style="font-size: 0.88rem; margin-top: 12px; color: var(--text-mid);">تحقق من Console للمزيد من التفاصيل</div>
        </td>
      </tr>
    `;
  }
}

// Load orders from API
async function loadOrdersFromAPI() {
  // Skip if already loading or loaded recently (< 2 seconds ago)
  const now = Date.now();
  if (isLoadingOrders || (now - lastOrdersLoadTime < 2000)) {
    console.log('[Orders] Skipping load - already loading or loaded recently');
    return false;
  }

  isLoadingOrders = true;
  lastOrdersLoadTime = now;

  try {
    const data = await LAMSA_API.adminGetOrders({ 
      page: 1, 
      limit: 100,
      cache: 'no-store' // Force fresh data
    });
    
    // After Task 5 fix: API returns data directly: {success, data: {orders: [...], pagination: {...}}}
    if (data && data.data && data.data.orders) {
      ordersCache = data.data.orders;
      console.log(`[Orders] Loaded ${ordersCache.length} orders from API`);
      console.log(`[Orders] Calling renderAllOrders()...`);
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        renderAllOrders();
        console.log(`[Orders] renderAllOrders() completed`);
      });
      return true;
    } else {
      console.error('[Orders] Load failed - unexpected data structure. Expected data.data.orders, got:', Object.keys(data || {}));
      console.error('[Orders] Full response:', data);
      showErrorInTable('خطأ في تحميل الطلبات: البيانات بتنسيق غير متوقع');
      return false;
    }
  } catch (error) {
    console.error('[Orders] Load error:', error.message || error);
    showErrorInTable('خطأ في تحميل الطلبات: ' + (error.message || 'خطأ في الاتصال'));
    return false;
  } finally {
    isLoadingOrders = false;
  }
}

// Load orders stats from API
async function loadOrdersStats() {
  try {
    const data = await LAMSA_API.adminGetOrdersStats();
    
    // After Task 5 fix: API returns data directly on success
    if (data && data.data) {
      ordersStats = data.data;
      updateDashboardStats();
      return true;
    } else {
      console.error('[Orders] Stats load failed:', data);
      return false;
    }
  } catch (error) {
    console.error('[Orders] Stats load error:', error.message || error);
    return false;
  }
}

// Render orders table
function renderAllOrders() {
  console.log('[Orders] renderAllOrders() called with', ordersCache.length, 'orders');
  
  try {
    const tbody = document.getElementById('allOrdersTable');
    
    if (!tbody) {
      console.error('[Orders] Render failed: tbody#allOrdersTable not found');
      return;
    }
    
    console.log(`[Orders] tbody found, rendering ${ordersCache.length} orders`);
    
    // Count only pending orders for the tab badge
    const pendingCount = ordersCache.filter(o => (o.status || o.orderStatus) === 'pending').length;
    const badgeEl = document.getElementById('tabOrderCount');
    if (badgeEl) {
      badgeEl.textContent = pendingCount;
      console.log(`[Orders] Badge updated to ${pendingCount}`);
    } else {
      console.error('[Orders] Badge element #tabOrderCount not found');
    }
    console.log(`[Orders] Pending count: ${pendingCount}`);

  if (ordersCache.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 48px 20px; color: var(--text-light);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">📭</div>
          <strong>لا توجد طلبات واردة حالياً</strong>
          <div style="font-size: 0.88rem; margin-top: 6px;">عندما يقوم أي عميل بطلب أوردر من الموقع سيظهر هنا فوراً.</div>
        </td>
      </tr>
    `;
    return;
  }

  // Sort: pending first, then by date (newest first)
  const sortedOrders = ordersCache.slice().sort((a, b) => {
    const aStatus = a.status || a.orderStatus;
    const bStatus = b.status || b.orderStatus;
    if (aStatus === 'pending' && bStatus !== 'pending') return -1;
    if (aStatus !== 'pending' && bStatus === 'pending') return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  tbody.innerHTML = sortedOrders.map((order) => {
    // SECURITY: Escape all user/database-provided text to prevent XSS
    const safeOrderNum = escapeHtml(order.orderNumber);
    const safeCustName = escapeHtml(order.customerName || 'عميل');
    const safePhone = escapeHtml(order.customerPhone || order.phone || '');
    const safeWhatsapp = escapeHtml(order.whatsapp);
    const safeCity = escapeHtml(order.governorate || order.city || '—');
    const safeAddress = escapeHtml(order.address || '');
    const safeNotes = escapeHtml(order.notes);
    
    const phone = order.customerPhone || order.phone || '';
    const whatsapp = order.whatsapp; // Optional WhatsApp number (separate from phone)
    const cleanPhone = phone.replace(/^(\+20|0)/, '');
    const waLink = whatsapp 
      ? `https://wa.me/20${whatsapp.replace(/^(\+20|0)/, '')}` 
      : `https://wa.me/20${cleanPhone}`;
    
    // Format items display with XSS protection
    const itemsText = (order.items || []).map(item => {
      const safeProdName = escapeHtml(item.productName || 'منتج');
      const safeProdEmoji = escapeHtml(item.productEmoji || '📦');
      const safeImageUrl = escapeHtml(item.productImage || '');
      const imageUrl = item.productImage;
      
      return `<div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; margin-bottom: 6px;">
        ${imageUrl 
          ? `<img src="${safeImageUrl}" alt="${safeProdName}" style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border);" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
             <span style="font-size: 1.2rem; display: none;">${safeProdEmoji}</span>` 
          : `<span style="font-size: 1.2rem;">${safeProdEmoji}</span>`
        }
        <span>${safeProdName} × ${item.quantity}</span>
      </div>`;
    }).join('');
    
    // Add custom perfume if exists
    const customPerfumeText = order.customPerfume ? `
      <div style="background:linear-gradient(135deg, #5C0E14 0%, #8B1538 100%); padding:10px; border-radius:8px; margin-top:8px; color:white; font-size:0.8rem; line-height:1.5;">
        <div style="font-weight:700; margin-bottom:4px; color:var(--gold);">🌹 ${escapeHtml(order.customPerfume.customName || 'تركيبة خاصة')}</div>
        <div style="font-size:0.75rem;">
          <div>🍋 ${escapeHtml(order.customPerfume.topNote)}</div>
          <div>🌸 ${escapeHtml(order.customPerfume.heartNote)}</div>
          <div>🪵 ${escapeHtml(order.customPerfume.baseNote)}</div>
          <div style="margin-top:4px; color:var(--gold); font-weight:600;">🧴 ${order.customPerfume.size} • ${order.customPerfume.concentration.toUpperCase()}</div>
        </div>
      </div>
    ` : '';
    
    const productsDisplay = (itemsText || customPerfumeText) || '<span style="color:var(--text-light);">—</span>';
    
    const dateStr = new Date(order.createdAt).toLocaleString('ar-EG', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    });
    
    const displayStatus = STATUS_MAP[order.status] || STATUS_MAP[order.orderStatus] || order.status;
    
    let badgeClass = 'status-new';
    const statusKey = order.status || order.orderStatus;
    if (statusKey === 'confirmed') badgeClass = 'status-confirmed';
    else if (statusKey === 'shipped') badgeClass = 'status-shipping';
    else if (statusKey === 'delivered') badgeClass = 'status-done';
    else if (statusKey === 'cancelled') badgeClass = 'status-canceled';

    const paymentDisplay = PAYMENT_MAP[order.paymentMethod] || order.paymentMethod;

    return `
      <tr>
        <td><strong style="color:var(--burgundy); font-family:monospace;">
          ${safeOrderNum}
          ${order.customPerfume ? '<span class="badge" style="background:linear-gradient(135deg, #5C0E14 0%, #8B1538 100%); border:1px solid var(--gold); color:var(--gold); font-size:0.7rem; padding:2px 6px; margin-right:6px;">🌹 عطر</span>' : ''}
        </strong></td>
        <td style="white-space:nowrap; font-size:0.85rem;">${dateStr}</td>
        <td><strong>${safeCustName}</strong></td>
        <td>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <a href="tel:${safePhone}" class="action-btn-sm btn-call" title="اتصال مباشر بالهاتف">
              📞 ${safePhone}
            </a>
            ${whatsapp ? `<a href="${waLink}" target="_blank" class="action-btn-sm btn-wa" title="مراسلة واتساب">
              💬 واتساب: ${safeWhatsapp}
            </a>` : `<a href="${waLink}" target="_blank" class="action-btn-sm btn-wa" title="مراسلة واتساب">
              💬 محادثة واتساب
            </a>`}
          </div>
        </td>
        <td style="font-size:0.88rem;">
          <div><strong>${safeCity}</strong></div>
          <div style="color:var(--text-light); font-size:0.82rem;">${safeAddress}</div>
          ${order.notes && !order.notes.includes('واتساب:') ? `<div style="color:var(--text-mid); font-size:0.75rem; margin-top:4px;">ملاحظات: ${safeNotes}</div>` : ''}
        </td>
        <td>${productsDisplay}</td>
        <td><strong style="color:var(--gold); font-size:1.05rem;">${order.total || order.totalAmount} ج.م</strong></td>
        <td style="font-size:0.85rem;">${paymentDisplay}</td>
        <td>
          <span class="status-badge ${badgeClass}">${displayStatus}</span>
          <select 
            onchange="updateOrderStatusAPI('${order.id}', this.value)" 
            style="display:block; margin-top:6px; padding: 4px 8px; border-radius: 8px; font-family: inherit; font-size: 0.85rem; border: 1px solid var(--border); background: var(--bg-surface); color: var(--text-dark); width: 100%;"
          >
            ${generateStatusOptions(statusKey)}
          </select>
        </td>
        <td>
          <button class="action-btn-sm" onclick="viewOrderDetails('${order.id}')" style="background: rgba(107, 19, 25, 0.1); color: var(--burgundy);">
            👁️ عرض
          </button>
        </td>
      </tr>
    `;
  }).join('');
  } catch (error) {
    console.error('[Orders] Render error:', error.message || error, error.stack);
    showErrorInTable('خطأ في عرض الطلبات: ' + (error.message || 'خطأ غير متوقع'));
  }
}

// Allowed status transitions
const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [], // Final state
  cancelled: []  // Final state
};

// Get allowed next statuses
function getAllowedNextStatuses(currentStatus) {
  return ALLOWED_TRANSITIONS[currentStatus] || [];
}

// Generate status dropdown options (only show current + allowed next)
function generateStatusOptions(currentStatus) {
  const allStatuses = {
    'pending': 'جديد ⏳',
    'confirmed': 'تم التأكيد 📞',
    'shipped': 'قيد الشحن 🚚',
    'delivered': 'تم التسليم ✅',
    'cancelled': 'تم الإلغاء ❌'
  };
  
  const allowedNext = getAllowedNextStatuses(currentStatus);
  const statusesToShow = [currentStatus, ...allowedNext];
  
  return statusesToShow.map(status => {
    const label = allStatuses[status] || status;
    const selected = status === currentStatus ? 'selected' : '';
    return `<option value="${status}" ${selected}>${label}</option>`;
  }).join('');
}

// Update order status via API
async function updateOrderStatusAPI(orderId, newStatus) {
  const orderIndex = ordersCache.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    showToast('❌ الطلب غير موجود');
    return;
  }
  
  const currentOrder = ordersCache[orderIndex];
  const currentStatus = currentOrder.status || currentOrder.orderStatus;
  const dropdown = event.target; // Save dropdown reference
  const originalValue = currentStatus;
  
  // If changing to cancelled, ask for confirmation
  if (newStatus === 'cancelled' && currentStatus !== 'cancelled') {
    const confirmCancel = confirm('⚠️ هل أنت متأكد من إلغاء هذا الطلب؟\n\nسيتم إرجاع الكميات للمخزون.');
    if (!confirmCancel) {
      // Restore dropdown to original value
      dropdown.value = originalValue;
      return;
    }
  }
  
  try {
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    
    const apiStatus = statusMap[newStatus] || newStatus;
    
    const response = await LAMSA_API.adminUpdateOrderStatus(orderId, apiStatus);
    
    if (response.success) {
      showToast('✅ تم تحديث حالة الطلب بنجاح');
      
      // Update local cache
      ordersCache[orderIndex].status = apiStatus;
      ordersCache[orderIndex].orderStatus = apiStatus;
      
      // Reload orders and stats to reflect changes (e.g., stock returned on cancellation)
      await loadOrdersFromAPI();
      await loadOrdersStats();
      
      renderAllOrders();
    } else {
      showToast('❌ فشل تحديث حالة الطلب: ' + (response.message || 'خطأ غير معروف'));
      // Restore dropdown to original value
      dropdown.value = originalValue;
      // Reload to restore correct status in UI
      await loadOrdersFromAPI();
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    showToast('❌ ' + (error.message || 'حدث خطأ أثناء تحديث حالة الطلب'));
    // Restore dropdown to original value
    dropdown.value = originalValue;
    // Reload to restore correct status in UI
    await loadOrdersFromAPI();
  }
}

// View order details (optional future enhancement)
async function viewOrderDetails(orderId) {
  try {
    const response = await LAMSA_API.adminGetOrder(orderId);
    
    if (response.success && response.data) {
      const order = response.data;
      
      // Simple alert with order details (can be enhanced with a modal)
      let details = `📋 تفاصيل الطلب ${order.orderNumber}\n\n`;
      details += `👤 العميل: ${order.customerName}\n`;
      details += `📞 الهاتف: ${order.customerPhone}\n`;
      details += `📍 العنوان: ${order.governorate} - ${order.address}\n`;
      details += `💳 الدفع: ${PAYMENT_MAP[order.paymentMethod] || order.paymentMethod}\n`;
      details += `\n📦 المنتجات:\n`;
      
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          details += `  • ${item.productEmoji || '📦'} ${item.productName} × ${item.quantity} = ${item.unitPrice * item.quantity} ج.م\n`;
        });
      }
      
      if (order.customPerfume) {
        const cp = order.customPerfume;
        details += `\n🌹 **عطر مخصص: ${cp.customName || 'تركيبة خاصة'}**\n`;
        details += `  🍋 المقدمة: ${cp.topNote}\n`;
        details += `  🌸 القلب: ${cp.heartNote}\n`;
        details += `  🪵 القاعدة: ${cp.baseNote}\n`;
        details += `  🧴 ${cp.size} • ${cp.concentration.toUpperCase()}\n`;
        details += `  💰 ${cp.calculatedPrice} ج.م\n`;
      }
      
      details += `\n💰 الإجمالي: ${order.total} ج.م`;
      details += `\n📅 التاريخ: ${new Date(order.createdAt).toLocaleString('ar-EG')}`;
      details += `\n📊 الحالة: ${STATUS_MAP[order.status] || order.status}`;
      
      if (order.notes) {
        details += `\n\n📝 ملاحظات: ${order.notes}`;
      }
      
      alert(details);
    } else {
      showToast('❌ فشل تحميل تفاصيل الطلب');
    }
  } catch (error) {
    console.error('Error viewing order:', error);
    showToast('❌ حدث خطأ أثناء عرض تفاصيل الطلب');
  }
}

// Update dashboard stats display
function updateDashboardStats() {
  document.getElementById('totalOrders').textContent = ordersStats.totalOrders || 0;
  document.getElementById('totalSales').textContent = (ordersStats.totalSales || 0) + ' ج.م';
  
  document.getElementById('todayOrders').textContent = ordersStats.todayOrders || 0;
  document.getElementById('todaySales').textContent = (ordersStats.todaySales || 0) + ' ج.م';
  
  document.getElementById('monthOrders').textContent = ordersStats.monthOrders || 0;
  document.getElementById('monthSales').textContent = (ordersStats.monthSales || 0) + ' ج.م';
}

// Initialize on page load
async function initializeOrdersManagement() {
  // Clear any existing timer (defensive - should never happen)
  if (ordersRefreshTimer) {
    clearInterval(ordersRefreshTimer);
    ordersRefreshTimer = null;
  }

  // Initial load
  await loadOrdersFromAPI();
  await loadOrdersStats();
  
  // Auto-refresh every 30 seconds, but only when tab is visible
  ordersRefreshTimer = setInterval(async () => {
    // Skip refresh if tab is hidden (save bandwidth and API calls)
    if (document.hidden) {
      console.log('[Orders] Skipping refresh - tab is hidden');
      return;
    }
    
    console.log('[Orders] Auto-refresh triggered');
    await loadOrdersFromAPI();
    await loadOrdersStats();
  }, 30000);
  
  console.log('[Orders] Management initialized with 30s refresh timer');
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (ordersRefreshTimer) {
    clearInterval(ordersRefreshTimer);
    ordersRefreshTimer = null;
  }
});

// Export functions for use in admin.html
window.renderAllOrders = renderAllOrders;
window.updateOrderStatusAPI = updateOrderStatusAPI;
window.viewOrderDetails = viewOrderDetails;
window.loadOrdersFromAPI = loadOrdersFromAPI;
window.loadOrdersStats = loadOrdersStats;
window.initializeOrdersManagement = initializeOrdersManagement;
window.ordersCache = ordersCache;
