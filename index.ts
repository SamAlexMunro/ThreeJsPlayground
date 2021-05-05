import { route } from './src/functions/router';
import { BasicScene } from './src/pages/basic_scene/basic_scene';
import { ThreeCameraPlayground } from './src/pages/cameras/cameras';
import { DatGuiExample } from './src/pages/dat_gui/dat_gui';
import { Homepage } from './src/pages/homepage/homepage';
import { SpaceEffect } from './src/pages/space_effect/space_effect';
import { TexturesExample } from './src/pages/textures/textures';

class Index {
  constructor() {
    route();
  }
}

new Index();
new BasicScene();
new Homepage();
new SpaceEffect();
new ThreeCameraPlayground();
new DatGuiExample();
new TexturesExample();
