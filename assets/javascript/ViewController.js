"use strict";
/* global Model, Utility */

class ViewController {

    constructor() {

        this._model = new Model();

        this._header = $("#header");

        this._techinLogoBig = $("#techinLogoBigWrapper");
        this._techinLogo = $("#techinLogo");
        this._jobTitleInput = $("#jobTitleInput");
        this._jobLocationInput = $("#jobLocationInput");
        this._jobLocationIcon = $("#locationIcon");
        this._jobRadiusInput = $("#jobRadiusInput");
        this._jobSalaryInput = $("#jobSalaryInput");

        this._searchIcon = $("#searchIcon");
        this._searchJobsSubmitBtn = $("#searchJobsSubmitBtn");

        this._jobTitleValue = null;
        this._locationValue = null;
        this._radiusValue = null;
        this._salaryValue = null;

        this._loading = $("#loading");

        this._jobResultsTBLWrapper = $("#jobResultsTBLWrapper");
        this._jobResultsTBL = $("#jobResultsTBL");

        // @ts-ignore
        this._jobResultsDataTable = this._jobResultsTBL.DataTable({

            "info": false,
            "pagingType": "numbers",
            columns: [
                { title: "Job Title" },
                { title: "Location" },
                { title: "Company" },
                { title: "Salary" },
                // { title: "Type" },
                // { title: "Source" },
                // { title: "Snippet" },
                { title: "Posted" },
                { title: "Link" }
            ],
            columnDefs: [
                { targets: "_all", className: 'dt-center' }
            ]
        });

        this._isStartCompleted = false;

        this.startSequence();

        this.assignInputListeners();

        this.assignUpdateTableListener();

        this.assignZipCodeListeners();
    }

    startSequence() {        

        this.showBigLogo().then(() => {

            setTimeout(() => {

                this.hideBigLogo().then(() => {

                    this.showHeader().then(() => {

                        this.showLogo();

                        setTimeout(() => { this.showJobTitleInput(); }, 250);

                        setTimeout(() => { this.showJobLocationInput(); }, 500);

                        setTimeout(() => { this.showLocationIcon(); }, 750);

                        setTimeout(() => { this.showJobRadiusInput(); }, 1000);

                        setTimeout(() => { this.showJobSalaryInput(); }, 1250);

                        setTimeout(() => { this.showSearchIcon(); }, 1500);

                    });
                }); 

            }, 500);
        });
    }

    assignInputListeners() {

        this._searchJobsSubmitBtn.click((event) => {

            event.preventDefault();

            if (this.isAllInputValid()) {

                // this.resetInputValidation();

                this.hideResultsTable().then(() => {

                    if (!this._isStartCompleted) {

                        this._header.animate({ top: '0%' }, 1500).promise().then(() => {
    
                            this._isStartCompleted = true;
                        });
                    }
    
                    setTimeout(() => { 

                        this.showLoadingIndicator(); 

                        this._model.getJobsFromAPI(this._jobTitleValue, this._locationValue, this._radiusValue, this._salaryValue);
                    }, 500);
                });
            }
        });

        this._jobTitleInput.keyup(() => {

            this.gatherAllInputValues();

            if (this._jobTitleValue.length === 0) {

                this.removeValidationStyle(this._jobTitleInput);
            }
            else if (Utility.isJobTitleInValid(this._jobTitleValue)) {

                this.markAsInValidStyle(this._jobTitleInput);
            }
            else {

                this.markAsValidStyle(this._jobTitleInput);
            }

            this.isAllInputValid();
        });

        this._jobLocationInput.keyup(() => {

            this.gatherAllInputValues();

            if (this._locationValue.length === 0) {

                this.removeValidationStyle(this._jobLocationInput);
            }
            else if (Utility.isLocationInValid(this._locationValue)) {

                this.markAsInValidStyle(this._jobLocationInput);
            }
            else {

                this.markAsValidStyle(this._jobLocationInput);
            }

            this.isAllInputValid();
        });

        this._jobRadiusInput.keyup(() => {

            this.gatherAllInputValues();

            if (this._radiusValue.length === 0) {

                this.removeValidationStyle(this._jobRadiusInput);
            }
            else if (Utility.isRadiusInValid(this._radiusValue)) {

                this.markAsInValidStyle(this._jobRadiusInput);
            }
            else {

                this.markAsValidStyle(this._jobRadiusInput);
            }

            this.isAllInputValid();
        });

        this._jobSalaryInput.keyup(() => {

            this.gatherAllInputValues();

            if (this._salaryValue.length === 0) {

                this.removeValidationStyle(this._jobSalaryInput);
            }
            else if (Utility.isSalaryInValid(this._salaryValue)) {

                this.markAsInValidStyle(this._jobSalaryInput);
            }
            else {

                this.markAsValidStyle(this._jobSalaryInput);
            }

            this.isAllInputValid();
        });
    }

    assignUpdateTableListener() {

        addEventListener("updateTable", () => {

            let promise = Utility.createPromise(() => this._isStartCompleted === true);

            promise.then(() => { 

                setTimeout(() => {

                    this.hideLoadingIndicator().then(() => {

                        const jobsJSON = this._model.getAllJobsJSONForTable();
        
                        this._jobResultsDataTable.clear().rows.add(jobsJSON).draw(false);
    
                        this.showResultsTable();
                    });

                }, 2000);
            });
        });
    }

    assignZipCodeListeners() {

        this._jobLocationIcon.mouseenter(() => {

            this.showActiveLocationIcon();
        });

        this._jobLocationIcon.mouseleave(() => {

            this.showInActiveLocationIcon();
        });

        this._jobLocationIcon.click(() => {

            this._model.setZipCode();
        });

        addEventListener("zipCodeReady", () => {

            const zipCode = this._model.getZipCode().toString();

            this._jobLocationInput.val(zipCode);

            this._jobLocationInput.focus();

            this.isAllInputValid();
        });
    }

    gatherAllInputValues() {

        this._jobTitleValue = this._jobTitleInput.val().toString().trim();
        this._locationValue = this._jobLocationInput.val().toString().trim();
        this._radiusValue = this._jobRadiusInput.val().toString().trim();
        this._salaryValue = this._jobSalaryInput.val().toString().trim();
    }

    resetInputValidation() {

        this.removeValidationStyle(this._jobTitleInput);
        this.removeValidationStyle(this._jobLocationInput);
        this.removeValidationStyle(this._jobRadiusInput);
        this.removeValidationStyle(this._jobSalaryInput);

        // this._jobTitleInput.val("");
        // this._jobLocationInput.val("");
        // this._jobRadiusInput.val("");
        // this._jobSalaryInput.val("");

        this.showInActiveSearchIcon();
    }

    isAllInputValid() {

        this.gatherAllInputValues();

        let isValid = true;

        if (this._jobTitleValue.length === 0 && this._locationValue.length === 0) { //&& this._radiusValue.length === 0 && this._salaryValue.length === 0) {

            this.resetInputValidation();

            return false;
        }

        if (Utility.isJobTitleInValid(this._jobTitleValue)) {

            this.markAsInValidStyle(this._jobTitleInput);

            isValid = false;
        }
        else {

            this.markAsValidStyle(this._jobTitleInput);
        }

        if (Utility.isLocationInValid(this._locationValue)) {

            this.markAsInValidStyle(this._jobLocationInput);

            isValid = false;
        }
        else {

            this.markAsValidStyle(this._jobLocationInput);
        }

        if (Utility.isRadiusInValid(this._radiusValue)) {

            this.markAsInValidStyle(this._jobRadiusInput);

            isValid = false;
        }
        else {

            this.markAsValidStyle(this._jobRadiusInput);
        }

        if (Utility.isSalaryInValid(this._salaryValue)) {

            this.markAsInValidStyle(this._jobSalaryInput);

            isValid = false;
        }
        else {

            this.markAsValidStyle(this._jobSalaryInput);
        }

        if (isValid) {

            this.showActiveSearchIcon();
        }
        else {

            this.showInActiveSearchIcon();
        }

        return isValid;
    }

    showActiveLocationIcon() {

        this._jobLocationIcon.attr("src", "./assets/images/locationIcon_Active.png");
    }

    showInActiveLocationIcon() {

        this._jobLocationIcon.attr("src", "./assets/images/locationIcon_Inactive.png");
    }

    showActiveSearchIcon() {

        this._searchIcon.attr("src", "./assets/images/searchIcon_Active.png");
    }

    showInActiveSearchIcon() {

        this._searchIcon.attr("src", "./assets/images/searchIcon_Inactive.png");
    }

    removeValidationStyle(element) {

        element.attr("style", "");
    }

    markAsValidStyle(element) {

        element.attr("style", "border: 2px solid rgba(42,252,156,1.0);");
    }

    markAsInValidStyle(element) {

        element.attr("style", "border: 2px solid rgba(251,103,105,1.0);");
    }

    showLoadingIndicator() {

        this._loading.fadeTo(500, 1.0);
    }

    hideLoadingIndicator() {

        return this._loading.fadeTo(250, 0.0).promise();
    }

    showResultsTable() {

        this._jobResultsTBLWrapper.fadeTo(500, 1.0);
    }

    hideResultsTable() {

        return this._jobResultsTBLWrapper.fadeTo(250, 0.0).promise();
    }

    showBigLogo() {

        return this._techinLogoBig.fadeTo(2000, 1.0).promise();
    }

    hideBigLogo() {

        return this._techinLogoBig.fadeTo(2000, 0.0).promise();
    }

    showHeader() {

        return this._header.fadeTo(1000, 1.0).promise();
    }

    showLogo() {

        this._techinLogo.fadeTo(250, 1.0);
    }

    showJobTitleInput() {

        this._jobTitleInput.fadeTo(250, 1.0);
    }

    showJobLocationInput() {

        this._jobLocationInput.fadeTo(250, 1.0);
    }

    showLocationIcon() {

        this._jobLocationIcon.fadeTo(250, 1.0);
    }

    showJobRadiusInput() {

        this._jobRadiusInput.fadeTo(250, 1.0);
    }

    showJobSalaryInput() {

        this._jobSalaryInput.fadeTo(250, 1.0);
    }

    showSearchIcon() {

        this._searchIcon.fadeTo(250, 1.0);
    }
}