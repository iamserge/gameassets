describe('deliveryCountDown', function() {

    it('should expose getTodayDateFromTime method', function() {
        expect(App.PDP.DeliveryCountdown.getTodayDateFromTime).toBeDefined();
    });
    
    describe('getTodayDateFromTime()', function() {
      
        it('should return current date with particular hours and minutes', function() {
            date = App.PDP.DeliveryCountdown.getTodayDateFromTime('13:30');
            todayDate = new Date();
            todayDate.setHours(13);
            todayDate.setMinutes(30);
            todayDate.setSeconds(0);
            expect(date).toEqual(todayDate);
        });
    });

    it('should expose checkIfInBetweenTime method', function() {
        expect(App.PDP.DeliveryCountdown.checkIfInBetweenTime).toBeDefined();
    });
    
    describe('isInBetweenTime()', function() {
        var before = '07:00',
            after = '13:00';

        

        it('should be false for time after cutoff time', function() {
            var timeNow = new Date();
            timeNow.setHours(14);
            timeNow.setMinutes(30);
            console.log(before, after);
            result = App.PDP.DeliveryCountdown.isInBetweenTime(before, after, timeNow);
            expect(result).toEqual(false);
        });

        it('should be false for time before start time', function() {
            var timeNow = new Date();
            timeNow.setHours(06);
            timeNow.setMinutes(30);
            result = App.PDP.DeliveryCountdown.isInBetweenTime(before, after, timeNow);
            expect(result).toEqual(false);
        });

        it('should be true if in between start time and cutoff time', function() {
            var timeNow = new Date();
            timeNow.setHours(11);
            timeNow.setMinutes(30);
           result = App.PDP.DeliveryCountdown.isInBetweenTime(before, after, timeNow);
            expect(result).toEqual(true);
        });
    });
});
