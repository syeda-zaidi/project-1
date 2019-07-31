"use strict";
/* global Model, Utility, moment, Datatable */

class ViewController {

    constructor() {

        this._model = new Model();

        this._scheduleTBL = $("#scheduleTBL");

        // @ts-ignore
        this._schedule = this._scheduleTBL.DataTable({

            "info": false,
            "pagingType": "numbers",
            columns: [
                { title: "Train Name" },
                { title: "Destination" },
                { title: "Frequency (min)" },
                { title: "Next Arrival" },
                { title: "Time To Arrival" },
                { title: "Remove" }
            ]
        });

        this._trainNameInput = $("#trainNameInput");
        this._destinationInput = $("#destinationInput");
        this._firstTimeInput = $("#firstTimeInput");
        this._frequencyInput = $("#frequencyInput");
        this._addTrainSubmitBtn = $("#addTrainSubmitBtn");

        this._tablePollFrequencyMS = 1000;
        this._isTablePollStarted = false;

        this.assignSubmitBtnListener();

        this.updateSchedulePoll(this._tablePollFrequencyMS);
    }

    assignSubmitBtnListener() {

        this._addTrainSubmitBtn.click((event) => {

            event.preventDefault();

            this._trainNameInput.attr("style", "");
            this._destinationInput.attr("style", "");
            this._firstTimeInput.attr("style", "");
            this._frequencyInput.attr("style", "");

            const trainName = this._trainNameInput.val().toString().trim();
            const destination = this._destinationInput.val().toString().trim();
            const firstTime = this._firstTimeInput.val().toString().trim();
            const frequency = this._frequencyInput.val().toString().trim();

            const wasSuccessful = this._model.addTrain(trainName, destination, firstTime, frequency);

            if (wasSuccessful) {

                this._trainNameInput.val("");
                this._destinationInput.val("");
                this._firstTimeInput.val("");
                this._frequencyInput.val("");

                this._schedule.row.add(this._model.getLastTrainJSON()).draw(false);
            }
            else {

                if (trainName.length === 0 && destination.length === 0 && firstTime.length === 0 && frequency.length === 0) {

                    return;
                }

                if (Utility.isTrainNameInValid(trainName)) {

                    this._trainNameInput.attr("style", "border: 2px solid red;");
                }
                else {

                    this._trainNameInput.attr("style", "border: 2px solid green;");
                }

                if (Utility.isDestinationInValid(destination)) {

                    this._destinationInput.attr("style", "border: 2px solid red;");
                }
                else {

                    this._destinationInput.attr("style", "border: 2px solid green;");
                }

                if (Utility.isFirstTimeInValid(firstTime)) {

                    this._firstTimeInput.attr("style", "border: 2px solid red;");
                }
                else {

                    this._firstTimeInput.attr("style", "border: 2px solid green;");
                }

                if (Utility.isFrequencyInValid(frequency)) {

                    this._frequencyInput.attr("style", "border: 2px solid red;");
                }
                else {

                    this._frequencyInput.attr("style", "border: 2px solid green;");
                }
            }
        });
    }

    updateSchedulePoll(pollFrequencyMS) {

        if (!this._isTablePollStarted) {

            this._isTablePollStarted = true;

            setInterval(() => {

                this._schedule.clear().rows.add(this._model.getTrainsJSON()).draw(false);

            }, pollFrequencyMS);
        }
    }

    static removeTrain(key) {

        var event = new CustomEvent("removeBtnClicked", {

            detail: {
                databaseKey: key
            }
        });

        dispatchEvent(event);
    }
}