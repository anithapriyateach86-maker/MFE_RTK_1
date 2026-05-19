const loadedRemotes = {};

export async function loadRemote(remoteName, remoteUrl) {
  if (loadedRemotes[remoteName]) return;

  // Step 1: Inject the remote script
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = remoteUrl;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load remote: ${remoteUrl}`));
    document.head.appendChild(script);
  });

  // Step 2: Initialize webpack shared scope FIRST
  await __webpack_init_sharing__("default");

  // Step 3: Get container from window
  const container = window[remoteName];

  if (!container) {
    throw new Error(`Remote container "${remoteName}" not found on window after script load`);
  }

  // Step 4: Initialize container with shared scope
  await container.init(__webpack_share_scopes__.default);

  loadedRemotes[remoteName] = container;
}

export async function getRemoteModule(remoteName, modulePath) {
  const container = loadedRemotes[remoteName] || window[remoteName];

  if (!container) {
    throw new Error(`Remote "${remoteName}" not loaded. Call loadRemote() first.`);
  }

  const factory = await container.get(modulePath);
  return factory();
}	 	  	      	 	    	    	    	    	 	