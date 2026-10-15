-- CreateIndex
CREATE INDEX "idx_contact_messages_read_created" ON "contact_messages"("is_read", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_order_items_order_id" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_orders_status_created" ON "orders"("order_status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_orders_phone" ON "orders"("phone");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "orders"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_products_category" ON "products"("category");

-- CreateIndex
CREATE INDEX "idx_products_category_subcategory" ON "products"("category", "sub_category");

-- CreateIndex
CREATE INDEX "idx_products_stock_qty" ON "products"("stock_qty");

-- CreateIndex
CREATE INDEX "idx_products_badge_created" ON "products"("badge", "created_at" DESC);
