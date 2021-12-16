const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v2';
const assets = [
  '/assets/audio/boat-idle.mp3',
  '/assets/audio/boat-running.mp3',
  '/assets/audio/calm-sea.mp3',
  '/assets/audio/game-over.mp3',
  '/assets/audio/music.mp3',
  '/assets/audio/trash-collected.mp3',
  '/assets/boat/scene.gltf',
  '/assets/box/scene.bin',
  '/assets/box/scene.gltf',
  '/assets/box/textures/Box_Material_baseColor.png',
  '/assets/box/textures/Box_Material_metallicRoughness.png',
  '/assets/box/textures/Box_Material_normal.png',
  '/assets/crate/scene.bin',
  '/assets/crate/scene.gltf',
  '/assets/crate/textures/Material_51_baseColor.png',
  '/assets/crate/textures/Material_51_normal.png',
  '/assets/refrigerator/license.txt',
  '/assets/refrigerator/scene.bin',
  '/assets/refrigerator/scene.gltf',
  '/assets/rock/scene.bin',
  '/assets/rock/scene.gltf',
  '/assets/rock/textures/Scene_-_Root_baseColor.png',
  '/assets/rock/textures/Scene_-_Root_normal.png',
  '/assets/trash/license.txt',
  '/assets/trash/scene.bin',
  '/assets/trash/scene.gltf',
  '/assets/trash/textures/trash_baseColor.jpeg',
  '/assets/trash/textures/trash_metallicRoughness.png',
  '/assets/trash/textures/trash_normal.png',
  '/assets/water/water.jpg',
];

// install event
self.addEventListener('install', (evt) => {
  console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      console.log(assets);
      cache.addAll(assets);
    }),
  );
});

// activate event
self.addEventListener('activate', (evt) => {
  console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key)),
      );
    }),
  );
});
