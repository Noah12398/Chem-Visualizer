from rest_framework.authentication import BasicAuthentication

class NoPopupBasicAuth(BasicAuthentication):
    def authenticate_header(self, request):
        # Prevent browser from showing its Basic Auth popup
        return ''
