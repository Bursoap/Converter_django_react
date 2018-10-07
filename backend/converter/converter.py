import re
from rest_framework.exceptions import APIException
from rest_framework.status import HTTP_400_BAD_REQUEST


class Convert(object):

    def __init__(self, number):
        self.default_error_code = HTTP_400_BAD_REQUEST
        self.number = number
        self.associative = {
            "I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000,
            "IV": 4, "IX": 9, "XL": 40, "XC": 90, "CD": 400, "CM": 900
        }

    def convert(self):
        self.number = self.validate_number()
        if isinstance(self.number, str):
            return self.rome_to_arab()
        else:
            return self.arab_to_rome()

    def validate_number(self):
        if not self.number:
            raise APIException(detail='Data should be specified', code=self.default_error_code)
        elif self.number.isdigit():
            if 0 <= int(self.number) <= 3999:
                return int(self.number)
            else:
                raise APIException(detail='Number should be between 0 and 3999', code=self.default_error_code)
        number_string = ''.join(self.number.split())
        for char in number_string:
            if char not in "IVXLCDM":
                raise APIException(detail='Enter a valid rome number', code=self.default_error_code)
            else:
                res = re.fullmatch(r'^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$', number_string)
                if res:
                    return res.string
                else:
                    raise APIException(detail='Enter a valid rome number', code=self.default_error_code)

    def rome_to_arab(self):
        string = self.number
        result = 0
        for i in range(len(string)):
            try:
                    if self.associative[string[i]] < self.associative[string[i+1]]:
                        result -= self.associative[string[i]]
                    else:
                        result += self.associative[string[i]]
            except IndexError:
                result += self.associative[string[i]]
        return result

    def arab_to_rome(self):
        count = self.number
        result = ""
        for rome_key, arab_value in sorted(self.associative.items(), key=lambda x: x[1], reverse=True):
            while count >= arab_value:
                result += rome_key
                count -= arab_value
        return result
