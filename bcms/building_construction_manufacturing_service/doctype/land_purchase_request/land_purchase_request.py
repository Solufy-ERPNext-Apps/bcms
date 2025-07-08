# Copyright (c) 2025, Shivangi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class LandPurchaseRequest(Document):
    def validate(self):
        if not self.requested_by:
            self.requested_by = frappe.session.user

        self.zi_name = frappe.db.get_value("User", self.requested_by, "full_name")
