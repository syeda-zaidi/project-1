"use strict";
/* global Utility, moment, firebase */

class Model {

    constructor() {

        this._firebase = new FireBase();
    }

    addTrain(name, dest, time, freq) {

        let newTrain = new Train(name, dest, time, freq);

        if (newTrain.isValid()) {

            this._firebase.addTrain(newTrain);

            return true;
        }

        return false;
    }

    getTrainsJSON() {

        let trainsJSON = [];

        for (let trainOBJ of this._firebase._trains) {

            trainsJSON.push(trainOBJ.getTrainJSON());
        }

        return trainsJSON;
    }

    getLastTrainJSON() {

        return this._firebase._trains[this._firebase._trains.length - 1].getTrainJSON();
    }
}


class FireBase {

    constructor() {

        this._trains = [];

        const config = {

            apiKey: "AIzaSyA8ittWnw7U7K8a7Rgsgz7T3Owi6XCoqWw",
            authDomain: "fir-test-ad074.firebaseapp.com",
            databaseURL: "https://fir-test-ad074.firebaseio.com",
            projectId: "fir-test-ad074",
            storageBucket: "",
            messagingSenderId: "371590315074",
            appId: "1:371590315074:web:f50de714abe3392f"
        };

        this._databaseName = "/TrainScheduler";

        // @ts-ignore
        this._database = firebase.initializeApp(config).database();

        this.syncWithDatabase();

        addEventListener("removeBtnClicked", (event) => {

            // @ts-ignore
            this.removeTrain(event.detail.databaseKey);
        });
    }

    addTrain(newTrain) {

        this._database.ref(this._databaseName).push(
            {
                trainName: newTrain._trainName,
                destination: newTrain._destination,
                firstTime: newTrain._firstTime,
                frequency: newTrain._frequency
            }
        );
    }

    removeTrain(key) {

        this._database.ref(this._databaseName).child(key).remove();

        this._trains = this._trains.filter(train => train._databaseKey !== key);
    }

    syncWithDatabase() {

        this._database.ref(this._databaseName).on("child_added", (snapshot) => {

            const newTrainJSON = snapshot.val();
     
            let newTrain = new Train(newTrainJSON.trainName, newTrainJSON.destination, newTrainJSON.firstTime, newTrainJSON.frequency);

            newTrain.setDatabaseKey(snapshot.key);

            this._trains.push(newTrain);

        }, (errorObject) => {

            alert("The read failed: " + errorObject.code);
            throw new Error("The read failed: " + errorObject.code);
        });
    }
}


class Train {

    constructor(name, dest, time, freq) {

        this._trainName = name;
        this._destination = dest;
        this._firstTime = time;
        this._frequency = freq;

        this._databaseKey = null;

        this._isValid = false;

        this.validate();
    }

    validate() {

        this._isValid = false;

        if (Utility.isTrainNameInValid(this._trainName)) {

            return;
        }

        if (Utility.isDestinationInValid(this._destination)) {

            return;
        }

        if (Utility.isFirstTimeInValid(this._firstTime)) {

            return;
        }

        if (Utility.isFrequencyInValid(this._frequency)) {

            return;
        }

        //parse it as an Integer now (passed validation already)
        this._frequency = parseInt(this._frequency);

        this._isValid = true;
    }

    isValid() {

        return this._isValid;
    }

    setDatabaseKey(key) {

        if (this._databaseKey === null) {

            this._databaseKey = key.toString();
        }
    }

    getTrainJSON() {

        let train = [];

        const frequencyMS = this._frequency * 60 * 1000;

        // First Time (pushed back 1 year to make sure it comes before current time)
        // @ts-ignore
        const firstTimeConvertedMS = moment(this._firstTime, "HH:mm").subtract(1, "years");

        // Difference between current time and firstTime (set back a year)
        // @ts-ignore
        const diffTimeMS = moment().diff(moment(firstTimeConvertedMS), "milliseconds");

        // Time apart (remainder)
        const timeRemainderMS = diffTimeMS % frequencyMS;

        const timeToArrivalMS = frequencyMS - timeRemainderMS;
        // @ts-ignore
        const nextArrivalMS = moment().add(timeToArrivalMS, "milliseconds");
        // @ts-ignore
        const nextArrivalFormatted = moment(nextArrivalMS).format("hh:mm a");
        // @ts-ignore
        const timeToArrivalFormatted = moment.utc(timeToArrivalMS).format("HH:mm:ss");

        const databaseKeyString = "\'" + this._databaseKey + "\'";

        const removeBtn = '<button class="removeBTN" onclick="ViewController.removeTrain(' + databaseKeyString + ');">Remove</button>';

        train.push(this._trainName);
        train.push(this._destination);
        train.push(this._frequency);
        train.push(nextArrivalFormatted);
        train.push(timeToArrivalFormatted);
        train.push(removeBtn);

        return train;
    }
}