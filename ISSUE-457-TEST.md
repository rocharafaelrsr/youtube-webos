# Experimental webOS playback build 0.5.4

This build retains the original webOS WebView and application ID, with no
Cobalt executable or root requirement. It is an experimental candidate for
webosbrew/youtube-webos#457, not a confirmed fix.

- Replaces the global structuredClone-based JSON.stringify hook with a
  targeted copy of plain playback requests (inspired by upstream PR #499).
- Honors the existing Enable ad blocking setting in the stringify hook,
  permitting a genuine comparison with advertising enabled after relaunch.
- Preserves native serialization for ordinary/non-cloneable JSON inputs.

Test with ads enabled and disabled separately. Close and relaunch the app
between tests. Use the same video and account, record whether playback
exceeds 15 minutes, the available quality, and any error. An HTTP/server
rejection or incompatible runtime may still stop both modes.

Install the all-architecture IPK from the Build & Test workflow artifact.
Uninstall the conflicting YouTube app first if the package manager requires it.
