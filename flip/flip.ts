enum FlipTile {
    Flipped = 'flipped',
    // Answer = 'answer'
}

class Flip {
    width: number;
    height: number;
    density: number;
    table: HTMLTableElement;
    isPlaying = true;
    delta: number[];
    tds: HTMLElement[] = [];
    /**
     * @param t field
     * @param option width, height, density
     */
    constructor(t: HTMLTableElement, ...option: number[]) {
        let [w, h, d] = option;
        // convert any invalid density to [0,100)
        d = Math.abs(d % 100);

        this.table = t;
        this.width = w;
        this.height = h;
        this.density = d;

        this.delta = [-w, -1, 0, 1, w];
    }

    initialize() {
        for (let h = 0; h < this.height; h++) {
            for (let w = 0, r = this.table.insertRow(0); w < this.width; w++) {
                r.insertCell();
            }
        }
        this.tds = $('td').get();
        this.shuffle();
    }

    flipAt(i: number) {
        // if not playing, do nothing
        if (!this.isPlaying) return;

        for (let td of this.searchAdjacent(i)) {
            td.classList.toggle(FlipTile.Flipped);
        }
        // if no tiles are flipped
        if (!this.tds.filter(t => t.classList.contains(FlipTile.Flipped)).length) {
            this.isPlaying = false;
        }
    }

    private shuffle() {
        let n = Math.floor(this.width * this.height * this.density / 100);
        let a = array(this.width * this.height);
        shuffle(a);
        while (n--) {
            this.flipAt(a[n]);
            // this.tds[a[n]].classList.toggle(FlipTile.Answer);
        }
    }

    private *searchAdjacent(i: number) {
        let t: HTMLElement;
        let ni: number;
        for (let d of this.delta) {
            ni = i + d;
            // if wrap
            if (i % this.width == 0 && ni % this.width == this.width - 1) continue;
            if ((i + 1) % this.width == 0 && ni % this.width == 0) continue;
            // if not outside boundry
            if (typeof (t = this.tds[ni]) != 'undefined') yield t;
        }
    }
}