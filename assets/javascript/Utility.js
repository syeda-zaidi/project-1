"use strict";
/* global moment */

class Utility {

    static createPromise(waitCondition) {

        const poll = (resolve) => {

            if (waitCondition()) {

                resolve();
            }
            else {

                setTimeout(() => poll(resolve), 100);
            }
        };

        return new Promise(poll);
    }

    static isTrainNameInValid(trainName) {

        if (trainName.length === 0) {

            return true;
        }
        
        return false;
    }

    static isDestinationInValid(destination) {

        if (destination.length === 0) {

            return true;
        }
        
        return false;
    }

    static isFirstTimeInValid(firstTime) {

         // @ts-ignore
         const isTimeValid = moment(firstTime, "HH:mm", true).isValid();

         if (!isTimeValid) {
 
             return true;
         }

         return false;
    }

    static isFrequencyInValid(frequency) {

        //check if all characters are numbers as parseInt() will generate a number if the first charaters in a string are numbers (even if followed with letters)
        if (isNaN(frequency)) {  

            return true;
        }

        //parse it as an Integer now
        frequency = parseInt(frequency);

        const isFreqNumber = typeof frequency === 'number';

        //Check on 1440 minutes is because this is over a day, so gives confusing results
        if (!isFreqNumber || isNaN(frequency) || frequency <= 0 || frequency > 1440) {

            return true;
        }

        return false;
    }
}

// @ts-ignore
const isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
const isEdge = navigator.userAgent.indexOf("Edge") > -1;
// @ts-ignore
const isChrome = !!window.chrome && !isOpera && !isEdge;
// @ts-ignore
const isExplorer= typeof document !== 'undefined' && !!document.documentMode && !isEdge;
// @ts-ignore
const isFirefox = typeof window.InstallTrigger !== 'undefined';
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);