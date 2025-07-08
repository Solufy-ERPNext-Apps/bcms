# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class LandAllocation(Document):
	import frappe
from frappe.model.document import Document

class LandAllocation(Document):
    def validate(self):
        # Check that selected Land Purchase is actually Purchased
        status = frappe.db.get_value("Land Purchase", self.land_purchase, "status")
        if status != "Purchased":
            frappe.throw("Selected land is not marked as 'Purchased'. Allocation not allowed.")

    def on_submit(self):
        # Update status of Land Purchase to 'Allocated'
        frappe.db.set_value("Land Purchase", self.land_purchase, "status", "Allocated")
