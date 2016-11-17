/**
 * Simple countdown script
 * Lea Verou - MIT license
 */
(function(){

var _ = self.CountDown = $.Class({
	constructor: function(date, now) {
		this.date = date;
		this.now = now || new Date();
	},

	update: function() {
		this.diff = this.date - this.now;
		this.seconds = this.diff / 1000;

		for (let unit in _.units) {
			let plural = unit + "s";
			let count = 0 || (this.seconds / _.units[unit] >> 0);
			this[plural] = count;

			if (_.units[unit] > 1) {
				this.seconds %= _.units[unit];
			}

		}

		this.past = this.diff < 0;
	},

	animate: function(element, {
		callback = function(){},
		units, terms,
		now = () => new Date()
	} = {}) {
		let repaint = () => {
			this.now = now();
			let array = this.toArray({units});
			let terms = 3;
			let text = this.toString({array, terms});
			let interval = _.units[(array[Math.min(array.length, terms) - 1]).unit] * 1000;

			element.textContent = ` (${text} remaining)`;
			
			let ret = callback.call(this);

			if (ret !== false) {
				this.animation = setTimeout(repaint, interval);
			}
		}

		repaint();
	},

	toArray: function({units = Object.keys(_.units)} = {}) {
		var ret = [];

		for (let unit in _.units) {
			let plural = unit + "s";
			let count = this[plural];

			if (count != 0 && units.indexOf(unit) > -1) {
				ret.push({
					count, unit,
					word: count == 1? unit : plural
				})
			}
		}

		return ret;
	},

	toString: function({
		units, terms,
		array = this.toArray({units})
	} = {}) {
		var ret = array.map(function(t){
			return `${t.count} ${t.word}`
		});

		if (terms > 0) {
			ret = ret.slice(0, terms);
		}

		if (ret.length > 1) {
			ret[ret.length - 1] = "and " + ret[ret.length - 1];
		}

		return ret.join(", ");
	},

	valueOf: function() {
		return this.diff;
	},

	live: {
		date: function(value) {
			this._date = value;
			this.update();
		},

		now: function(value) {
			this._now = value;
			this.update();
		}
	}
});

_.units = {
	year: 365 * 86400,
	month: 30.4368 * 86400,
	day: 86400,
	hour: 3600,
	minute: 60,
	second: 1
};

})();
