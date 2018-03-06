jQuery(function ($) {

    var Memory = {
        cardArray: [],
        html: '',
        timer: null,

        init: function () {
            this.$game = $('#gameField');
            this.$scoreField = $('#score');
            this.$restartBtn = $('.restart');
            this.$result = $('#resultField');
            this.generationArr();
            this.shuffling();
            this.setup();
            this.binding();
        },

        setup: function () {
            this.buildHTML();
            this.$game.html(this.html);
            this.setCards();
            this.guess = undefined;
            this.paused = false;
        },

        generationArr: function () {
            var used = [],
                arrCard = [],
                tmp;

            var rand = function () {
                var r = Math.random() * cards.length;
                r = r.toFixed(0)
                for (let i = 0; i < used.length; i++) {
                    if (r == used[i]) {
                        return rand();
                    }
                }
                return r;
            }

            for (let i = 0; i < 9; i++) {
                tmp = rand();
                arrCard[i] = cards[tmp];
                used[i] = tmp;
            }
            this.cardArray = $.merge(arrCard, arrCard);
        },

        shuffling: function () {
            var r, tmp;
            for (let i = 0; i < this.cardArray.length; i++) {
                r = (Math.random() * (this.cardArray.length - 1)).toFixed(0);
                tmp = this.cardArray[i];
                this.cardArray[i] = this.cardArray[r];
                this.cardArray[r] = tmp;
            }
        },

        buildHTML: function () {
            var str = '';
            for (let i = 0; i < this.cardArray.length; i++) {
                str += "<div class='card' data-tid='Card'><div class='front'><img src='./image/cards/shirtCard.png'></div><div class='back'><img src='." + this.cardArray[i].image + "'></div></div>";
            }
            this.html = str;
        },

        setCards: function () {
            this.$MemoryCards = $('.card');
            this.$MemoryCards.on('click', this.cardClicked);
            this.$MemoryCards.attr('onmousedown', 'return false');
        },

        setScalCards: function () {
            var elH = this.$MemoryCards.eq(0).find('.front img').eq(0).height();
            this.$MemoryCards.css('height', '');
            this.$MemoryCards.css({
                'height': elH,
            });
        },

        binding: function () {
            this.$restartBtn.on('click', this.restart);
        },

        cardClicked: function () {
            var _ = Memory;
            if (!_.paused && !$(this).hasClass('picked') && !$(this).hasClass('matched')) {
                $(this).addClass('picked');
                $(this).attr('data-tid', 'Card-flipped');
                if (_.guess == undefined) {
                    _.guess = $(this).index();
                } else {
                    if (_.cardArray[_.guess].id == _.cardArray[$(this).index()].id) {
                        _.paused = true;
                        this.timer = setTimeout(function () {
                            $('.picked').addClass('matched');
                            _.calcScore(true);
                            if ($('.matched').length == _.$MemoryCards.length) {
                                _.endGame();
                            }
                            _.paused = false;
                            _.guess = undefined;
                        }, 600);
                    } else {
                        _.paused = true;
                        this.timer = setTimeout(function () {
                            $('.picked').attr('data-tid', 'Card').removeClass('picked');
                            _.calcScore(false);
                            _.paused = false;
                            _.guess = undefined;
                        }, 600);
                    }
                }
            }
        },

        showAll: function () {
            var _ = Memory;
            _.paused = true;
            _.$MemoryCards.addClass('picked').attr('data-tid', 'Card-flipped');;
            setTimeout(function () {
                _.$MemoryCards.attr('data-tid', 'Card').removeClass('picked');
                _.paused = false;
            }, 5500)
        },

        endGame: function () {
            this.$result.html(this.$scoreField.html());
            $('#gamePage').css('top', '-3000px');
            $('#endPage').css({
                'top' : '0px',
                'z-index' : '1000',
            });
        },

        calcScore: function (d) {
            var newScore = this.$scoreField.html() * 1;
            if (d) {
                newScore += ((this.$MemoryCards.length - $('.matched').length) / 2) * 42;
            } else {
                newScore -= (($('.matched').length / 2)) * 42;
                if (newScore < 0) {
                    newScore = 0;
                }
            }
            this.$scoreField.html(newScore);
        },
        restart: function () {
            var _ = Memory;
            if (!_.paused) {
                $('#endPage').css({
                    'top' : '-6000px',
                    'z-index' : '0',
                });
                $('#gamePage').css('top', '-3000px');
                setTimeout(function () {
                    clearTimeout(_.timer);
                    _.cardArray.splice(0, _.cardArray.length)
                    _.generationArr();
                    _.shuffling();
                    _.setup();
                    _.showAll();
                    _.setScalCards();
                    _.$scoreField.html('0');
                    $('#gamePage').css('top', '0px');
                }, 500);
            }
        },
    }

    Memory.init();

    $(document).ready(function () {
        $('.start').click(function () {
            Memory.setScalCards();
            Memory.showAll();
            $('#startPage').css({
                'top' : '-3000px',
                'z-index' : '0',
            });
            $('#gamePage').css({
                'top' : '0px',
                'z-index' : '1000',
            });
            $(window).resize(function () {
                Memory.setScalCards();
            });

        });
    });

});
