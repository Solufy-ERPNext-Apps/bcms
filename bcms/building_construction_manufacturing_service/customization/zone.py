import frappe

def update_linked_land_purchases(self):
		land_purchases = frappe.get_all("Land Purchase", filters={"zone": self.name}, pluck="name")
		for lp in land_purchases:
			frappe.db.set_value("Land Purchase", lp, "zonal_incharge", self.zonal_incharge or "")
