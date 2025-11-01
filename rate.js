const RatingSystem = {
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    setItem: function (key, value) {
        localStorage.setItem(key, value);
    },
    update: function (){
        if(localStorage["win-count"] >= 5 || localStorage["lose-count"] >= 3){
            this.setItem("win-count", "0");
            this.setItem("lose-count", "0");
            this.setItem("total-point", Number(this.getItem("total-point")) + Number(this.getItem("point")));
            this.setItem("point", "0");
        }
    }
};


if (!(RatingSystem.getItem("win-count") && RatingSystem.getItem("lose-count") && RatingSystem.getItem("point") && RatingSystem.getItem("total-point"))) {
    RatingSystem.setItem("win-count", "0");
    RatingSystem.setItem("lose-count", "0");
    RatingSystem.setItem("point", "0");
    RatingSystem.setItem("total-point", "0");
}