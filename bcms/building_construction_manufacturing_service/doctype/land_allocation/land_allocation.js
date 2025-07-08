frappe.ui.form.on("Land Allocation", {
    refresh: function(frm) {
        // Filter only Purchased lands
        frm.set_query("land_purchase", () => {
            return {
                filters: {
                    status: "Purchased"
                }
            }
        });
    },

    land_purchase: function(frm) {
        // Auto-fill Allocated Zone from Land Purchase
        if (frm.doc.land_purchase) {
            frappe.db.get_value("Land Purchase", frm.doc.land_purchase, "zone", function (r) {
                if (r && r.zone) {
                    frm.set_value("allocated_zone", r.zone);
                }
            });
        }
    }
});


frappe.ui.form.on("Project Request", {
    land_allocation: function(frm) {
        frm.set_query("land_allocation", () => {
            return {
                filters: {
                    docstatus: 1 // only submitted allocations
                }
            }
        });
    }
});
