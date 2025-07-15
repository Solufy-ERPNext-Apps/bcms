import frappe

def validate(self,method=None):
    recommendation(self)

def recommendation(self):
    if self.custom_recommendation_letter and self.custom_proforma_for_sadh_sangat and self.custom_land_details and self.custom_site_plan:
        self.custom_recommendation == 1
        self.save()