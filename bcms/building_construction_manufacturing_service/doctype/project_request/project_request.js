frappe.ui.form.on('Project Request', {
	requested_by: function(frm) {
		if (frm.doc.requested_by) {
			frappe.db.get_doc('Employee', frm.doc.requested_by).then(employee => {
				frm.set_value('zone', employee.custom_zone);
				frm.set_value('unit', employee.custom_unit);
				frm.set_value('state', employee.custom_state);
				frm.set_value('khetra', employee.custom_khetra);
			});
		}
	},
	zone: function(frm) { 
		if(frm.doc.zone){
			frappe.db.get_doc('Zone', frm.doc.zone).then(zone => {
				frm.set_value('zonal_incharge_name', zone.zonal_incharge_name);
				frm.set_value('zone_email', zone.zone_email);
				frm.set_value('member_incharge',zone.member_incharge);
				frm.set_value('member_incharge_email',zone.member_incharge_email);
				frm.set_value('member_incharge_name',zone.member_incharge_name);		
		});
	}
	}
});