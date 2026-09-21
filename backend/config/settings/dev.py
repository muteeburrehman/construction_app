"""Development settings for Apex Construction Group."""

from .base import *  # noqa: F403
from .base import INSTALLED_APPS, MIDDLEWARE, REST_FRAMEWORK

DEBUG = True

ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True

INTERNAL_IPS = [
    "127.0.0.1",
    "localhost",
]

# Enable browsable API in dev
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [
    "rest_framework.renderers.JSONRenderer",
    "rest_framework.renderers.BrowsableAPIRenderer",
]

# Debug toolbar & nplusone
try:
    import debug_toolbar  # noqa: F401

    INSTALLED_APPS += ["debug_toolbar"]  # noqa: F405
    MIDDLEWARE = ["debug_toolbar.middleware.DebugToolbarMiddleware"] + MIDDLEWARE  # noqa: F405
except ImportError:
    pass

try:
    import nplusone  # noqa: F401

    INSTALLED_APPS += ["nplusone.ext.django"]  # noqa: F405
    MIDDLEWARE = ["nplusone.ext.django.NPlusOneMiddleware"] + MIDDLEWARE  # noqa: F405
    NPLUSONE_RAISE = False
except ImportError:
    pass
