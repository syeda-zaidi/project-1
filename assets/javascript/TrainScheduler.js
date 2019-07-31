"use strict";
/* global ViewController */

class TrainScheduler {

    constructor() {

        this._viewController = null;
    }

    startProgram() {
    
        this._viewController = new ViewController();
    }
}