from django.http import JsonResponse
from rest_framework.views import APIView
from converter.converter import Convert


class ConverterAPIView(APIView):

    def post(self, request):
        number_to_convert = str(request.data['number'])
        converter = Convert(number_to_convert)
        result = {'data': converter.convert()}
        return JsonResponse(result)
