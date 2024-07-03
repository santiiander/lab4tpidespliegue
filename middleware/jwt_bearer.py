from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer

from utilss.jwt_manager import validate_token


class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        if request.url.path in ["/login"]:
            return
        if request.url.path in ["/usuarios"] and request.method == "POST":
            return
        auth = await super().__call__(request)
        data = validate_token(auth.credentials)