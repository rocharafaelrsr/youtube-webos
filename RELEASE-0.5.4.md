# 0.5.4 Stable (independent fork)

This release promotes the exact IPK built and tested as 0.5.4 RC1; it does not rebuild or change the tested application.

- Original WebView architecture and application ID, all-architecture IPK.
- Targeted JSON serialization fix inspired by upstream PR #499; respects the existing ad-blocking setting.
- Ten regression checks, production build, JavaScript compatibility checks and packaging passed.
- Fork owner's LG 55NANO80: normal use from Nov 26 to Nov 28, 2026, without the previously experienced playback interruptions.
- The Cobalt alternative could not be installed on this particular TV.

This is a temporary, best-effort compatibility workaround while the upstream port matures. It is not an official upstream release or proof that issue #457 is solved for every device. Firmware/model variations and server-side changes may still affect playback.

Tested source: 5639b00383e70b91cc5cc64f60df7088cd7e1b3e
CI: https://github.com/rocharafaelrsr/youtube-webos/actions/runs/45733464839
IPK SHA-256: 46204509613e2e3da5bbaef838822e66efcca10a1536b68c4ec2be18d24be536

Thanks to the upstream maintainers and contributors, especially the author of PR #499.
