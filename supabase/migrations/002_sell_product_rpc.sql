create or replace function sell_product(p_id uuid)
returns json as $$
declare
  v_product products%rowtype;
begin
  -- Lock the row to prevent concurrent modifications
  select * into v_product from products where id = p_id for update;

  if not found then
    raise exception 'Product not found';
  end if;

  if v_product.stock <= 0 then
    raise exception 'Out of stock';
  end if;

  -- Decrement stock
  update products set stock = stock - 1 where id = p_id;

  -- Log the sale with product snapshots
  insert into sales_log (product_id, quantity, snapshot_name, snapshot_price, snapshot_serial)
  values (p_id, 1, v_product.name, v_product.price, v_product.serial);

  return json_build_object('new_stock', v_product.stock - 1);
end;
$$ language plpgsql;
