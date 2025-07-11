//show the pdf file and also less than the size of 750kb
frappe.ui.form.on("Land Purchase", {
	refresh: function (frm) {
		const pdf_fields = [
			"title_deed",
			"sale_agreement",
			"encumbrance_certificate_ec",
			"giftinheritance_deed",
			"mutation_record",
			"survey_sketch",
			"zoning_certificate",
			"topographic_map",
			"property_tax_receipts",
			"khatapatta_extract",
			"no_dues_certificate",
			"building_approval_plan",
			"environmental_clearance",
			"land_conversion_certificate",
			"legal_opinion_report",
			"valuation_report",
			"land_inspection_report",
			"signed_nocs",
			"historical_records",
			//last updated
			"attached_copy_of_google_map_of_your_area",
			"ownership_document",
			"khatoni_attachment",
			"recommendation",
			"letter_document",
			"search_report",
			"bank_ac",
			"pan_card",
			"aadhaar_card",
			"sizrasite_plan",
			"letter_of_offer_agreement",
			"attached_statement_of_account_of_last_three_year_of_your_branch",
			"cancelled_cheque_photocopy",
			"supporting_documents",
			"donation_deed_document",
			"certificate_of_registration_of_company",
			"articles_of_association",
			"memorandum_of_association",
			"site_plan_in_sq_ft",
			"gram_sabha_committee_resolution",
			"registration_document_with_history",
			"khasra__khatauni__faraza_for_agricultural_land",
			"letter_from_gram_sabha_for_snm",
			"partnership_deed",
			"site_map_of_proposed_land",
			"copy_of_sizra",
			"photocopy_of_khatoni_registry",
			"authorized_signatory_and_kyc_documents_for_partnership__company",
			"aadhaar_upload",
			"pan_card_upload",
			"cancelled_cheque_upload",
			"loan_liability_confirmation_from_bank",
			"attach_zbam",
			"upload_document_sellers_gram",
			"upload_document_offer_letter",
			"upload_document_if_yes",
			"copy_of_resolution"

		];

		pdf_fields.forEach(fieldname => {
			restrict_attach_to_pdf(frm, fieldname);
		});
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
				if (file.file_size > 750 * 1024) {
					frappe.throw("File size must be less than or equal to 750 KB.");
					return;
				}
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

//colaboration of the both fieds like title deed and name
frappe.ui.form.on('Land Purchase', {
	title_deed: function(frm) {
		set_doc_id_from_file(frm);
	},
	validate: function(frm) {
		set_doc_id_from_file(frm);
	}
});

function set_doc_id_from_file(frm) {
	if (frm.doc.title_deed && frm.doc.name) {
		frappe.db.get_value('File', { file_url: frm.doc.title_deed }, ['file_name'])
			.then(r => {
				if (r && r.message && r.message.file_name) {
					const file_name = r.message.file_name;
					const land_purchase_id = frm.doc.name; 
					frm.set_value('doc_id', `${file_name} - ${frm.doc.name}`);
				}
			});
	}
}

frappe.ui.form.on('Land Purchase', {
	refresh: function(frm) {
		load_google_maps_api().then(() => {
			init_location_autocomplete(frm);
		});
	}
});

//location to get lat and long
frappe.ui.form.on('Land Purchase', {
	map: function(frm) {
		if (frm.doc.map) {
			try {
				let geojson = JSON.parse(frm.doc.map);
				if (geojson.features && geojson.features.length > 0) {
					let geometry = geojson.features[0].geometry;

					if (geometry.type === "Point" && geometry.coordinates.length === 2) {
						let longitude = geometry.coordinates[0];
						let latitude = geometry.coordinates[1];

						frm.set_value("latitude", latitude);
						frm.set_value("longitude", longitude);
					}
				}
			} catch (e) {
				console.error("Invalid GeoJSON:", e);
			}
		}
	}
});


//fatch long,lat and maap
frappe.ui.form.on('Land Purchase', {
	latitude: function(frm) {
		frm.set_value("lattitude", frm.doc.latitude || "");
	},
	longitude: function(frm) {
		frm.set_value("longgitude", frm.doc.longitude || "");
	},
	location: function(frm) {
		frm.set_value("map", frm.doc.location || "");
	}
});

frappe.ui.form.on('Land Purchase', {
    zone(frm) {
        if (frm.doc.zone) {
            frappe.db.get_doc('Zone', frm.doc.zone).then(zone => {
                frm.set_value('zonal_incharge', zone.zonal_incharge || '');
                frm.set_value('zonal_incharge_email', zone.zonal_incharge_email || '');
                frm.set_value('zonal_incharge_name', zone.zonal_incharge_name || '');
            });
        } else {
            frm.set_value('zonal_incharge', '');
            frm.set_value('zonal_incharge_email', '');
            frm.set_value('zonal_incharge_name', '');
        }
    }
});
