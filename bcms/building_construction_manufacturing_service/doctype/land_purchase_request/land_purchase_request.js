// Copyright (c) 2025, Shivangi and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Land Purchase Request", {
// 	refresh(frm) {

// 	},
// });


frappe.listview_settings['Land Purchase Request'] = {
    onload: function(listview) {
        if (frappe.session.user != "Administrator") {
            listview.filter_area.add([[ "workflow_state", "=", "Pending Approval" ]]);
        }
    }
}
