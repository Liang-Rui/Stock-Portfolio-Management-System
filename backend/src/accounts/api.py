from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ChangePasswordSerializer
from rest_framework import status

# Register API


class RegisterAPI(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            # use knox package to create user
            "token": AuthToken.objects.create(user)[1]
        })

# Login API


class LoginAPI(generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            # use knox package to login
            "token": AuthToken.objects.create(user)[1]
        })

# Get User API


class UserAPI(generics.RetrieveAPIView):
    # validate if the user login
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        # get the data info of this user
        return self.request.user

# Change Password API


class ChangePasswordAPI(generics.UpdateAPIView):
    queryset = User.objects.all()
    # validate if the user login
    permission_classes = (
        permissions.IsAuthenticated,
    )
    serializer_class = ChangePasswordSerializer
    model = User

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            old_password = serializer.data.get("old_password")
            if not self.object.check_password(old_password):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response("Success.", status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
