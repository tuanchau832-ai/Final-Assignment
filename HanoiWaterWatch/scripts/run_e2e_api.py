"""Serve the built app against a disposable database for browser tests."""
import os
import secrets
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

import uvicorn

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'backend'))


def main():
    with TemporaryDirectory(prefix='waterwatch-e2e-') as directory:
        database = (Path(directory) / 'e2e.db').as_posix()
        os.environ.update({
            'DATABASE_URL': os.environ.get('HWW_TEST_DATABASE_URL', f'sqlite:///{database}'),
            'JWT_SECRET': secrets.token_hex(32),
            'COOKIE_SECURE': 'false',
            'DEMO_MODE': 'true',
            'REPLAY_TLH_ENABLED': 'false',
            'FRONTEND_DIST': os.environ.get('HWW_E2E_FRONTEND_DIST', str(ROOT / 'frontend' / 'dist')),
            'DEMO_REVIEWER_USERNAME': os.environ['HWW_E2E_USERNAME'],
            'DEMO_REVIEWER_PASSWORD': os.environ['HWW_E2E_PASSWORD'],
        })
        uvicorn.run('app.main:create_app', factory=True, host='127.0.0.1',
                    port=int(os.environ.get('HWW_E2E_PORT', '8176')), access_log=False)


if __name__ == '__main__':
    main()
