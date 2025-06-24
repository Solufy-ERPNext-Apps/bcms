// Copyright (c) 2025, Shivangi and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Land Purchase", {
// 	refresh(frm) {

// 	},
// });


// frappe.ui.form.on("Land Purchase", {
//     refresh: function (frm) {
//         const fieldname = "title_deed";  

//         frm.fields_dict[fieldname].on_attach_click = function () {
//             new frappe.ui.FileUploader({
//                 restrictions: {
//                     allowed_file_types: ['application/pdf'], 
//                 },
//                 on_success(file) {
//                     frm.set_value(fieldname, file.file_url);  
//                 },
//                 dialog: {
//                     only_file: true,
//                     allow_upload_file: true,
//                     allow_browse_files: true,
//                     allow_dropbox: false,
//                     allow_google_drive: false,
//                     allow_url: false,
//                     allow_camera: false,
//                 }
//             }).dialog.show();
//         };
//     }
// });


frappe.ui.form.on("Land Purchase", {
	refresh: function (frm) {
		restrict_attach_to_pdf(frm, "title_deed");
		restrict_attach_to_pdf(frm, "sale_agreement");
		restrict_attach_to_pdf(frm, "encumbrance_certificate_ec");
		restrict_attach_to_pdf(frm, "giftinheritance_deed");
		restrict_attach_to_pdf(frm, "mutation_record");
		restrict_attach_to_pdf(frm, "survey_sketch");
		restrict_attach_to_pdf(frm, "zoning_certificate");
		restrict_attach_to_pdf(frm, "topographic_map");
		restrict_attach_to_pdf(frm, "property_tax_receipts");
		restrict_attach_to_pdf(frm, "khatapatta_extract");
		restrict_attach_to_pdf(frm, "no_dues_certificate");
		restrict_attach_to_pdf(frm, "building_approval_plan");
		restrict_attach_to_pdf(frm, "environmental_clearance");
		

	}
});

function restrict_attach_to_pdf(frm, fieldname) {
	const attach_field = frm.fields_dict[fieldname];
	if (!attach_field) return;

	attach_field.on_attach_click = function () {
		new frappe.ui.FileUploader({
			restrictions: {
				allowed_file_types: ["application/pdf"]
			},
			on_success(file) {
				frm.set_value(fieldname, file.file_url);
			},
			dialog: {
				only_file: true,
				allow_upload_file: true,
				allow_browse_files: true,
				allow_dropbox: false,
				allow_google_drive: false,
				allow_url: false,
				allow_camera: false
			}
		}).dialog.show();
	};
}
