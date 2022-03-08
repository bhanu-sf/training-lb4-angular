// Uncomment these imports to begin using these cool features!

import { get } from "@loopback/rest";

// import {inject} from '@loopback/core';


export class ProfileController {
  constructor() {}

  @get('/profile')
  getProfile() {
    return 'this works'
  }
  
}
