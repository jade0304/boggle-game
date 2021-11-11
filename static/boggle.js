class BoggleGame {

    constructor(boardId, secs = 60) {
        this.secs = secs; // game length
        this.showTimer();

        this.score = 0
        this.words = new Set(); 
        this.board = $("#" + boardId)

        this.timer = setInterval(this.countDown.bind(this), 1000);

        $('.add-word', this.board).on('submit', this.handleSubmit.bind(this));
    }
    

    showListOfWords(word){
        $('.words', this.board).append($("<li>", {text: word}))
    }

    score(){
        $('.score', this.board).text(this.score)
    }

    message(msg, cls){
        $('.msg', this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }


    async handleSubmit(evt) {
        evt.preventDefault();
        const $word = $('.word', this.board)

        let word = $word.val();
        if (!word) return

        if (this.words.has(word)) {
            this.message(`Already found ${word}`, 'error')
            return;
        }

    const resp = await axios.get('/check-word', {params: {word: word}});
    if (resp.data.result === "not-word") {
        this.message(`${word} is not a valid english word`, 'error')
    } else if (resp.data.result === "not-on-board") {
        this.message(`${word} is not a valid word on this board`, 'error')
    } else {
        this.showListOfWords(word);
        this.score += word.length;
        this.score();
        this.words.add(word);
        this.message(`Added: ${word}`, 'ok');
    }
console.log(this.message(`Added: ${word}`, 'ok'))
    $word.val("").focus();
}


showTimer(){ 
    let $timer = $(".timer", this.board)
    $timer.text(this.secs);
    console.log($timer)
    console.log(this.secs)
}

async countDown(){
    console.log(this.secs)
    this.secs -= 1;
    this.showTimer();
    
    if(this.secs === 0){
    clearInterval(this.timer);
    await this.gameScore(); 
}
}

    async gameScore() {
        $(".add-word", this.board).hide();
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.brokeRecord) {
          this.message(`New record: ${this.score}`, "ok");
        } else {
          this.message(`Final score: ${this.score}`, "ok");
        }
      }
}

