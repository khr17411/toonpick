# server.py
import logging
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import urllib.request
from urllib.parse import urlparse, parse_qs, unquote

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(message)s')

class ProxyHTTPRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/thumb_proxy'):
            # 쿼리에서 원본 URL 꺼내기
            qs   = parse_qs(urlparse(self.path).query)
            orig = qs.get('url', [''])[0]
            orig = unquote(orig)
            logging.info(f"Proxy request for: {orig!r}")
            if orig:
                parsed = urlparse(orig)
                host   = parsed.hostname or ''
                # 헤더 준비: Referer + User-Agent
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                }
                if 'toomics.com' in host:
                    headers['Referer'] = 'https://www.toomics.com'
                elif 'smurfs.toptoon.com' in host or 'toptoon.com' in host:
                    headers['Referer'] = 'https://toptoon.com'
                elif 'naver.com' in host or 'pstatic.net' in host:
                    headers['Referer'] = 'https://comic.naver.com'

                try:
                    req  = urllib.request.Request(orig, headers=headers)
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        logging.info(f"  → {resp.status} {resp.getheader('Content-Type')}")
                        # 응답 전달
                        self.send_response(resp.status)
                        for h in ('Content-Type', 'Cache-Control', 'Expires', 'Last-Modified'):
                            v = resp.headers.get(h)
                            if v:
                                self.send_header(h, v)
                        self.end_headers()
                        self.copyfile(resp, self.wfile)
                except Exception as e:
                    logging.error(f"  Proxy error: {e}")
                    self.send_error(502, f"Bad gateway: {e}")
                return

        # /thumb_proxy 이외 요청은 정적 파일 서빙
        return super().do_GET()


if __name__ == '__main__':
    addr = ('', 8000)
    httpd = ThreadingHTTPServer(addr, ProxyHTTPRequestHandler)
    logging.info("▶ 서버 가동: http://localhost:8000")
    httpd.serve_forever()
