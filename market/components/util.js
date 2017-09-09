/**
 * Created by Akihiro-Kato on 2016/12/17.
 */

module.exports = {
	floatFormat: function(number, n){
		var _pow = Math.pow( 10 , n ) ;
		return Math.round( number * _pow ) / _pow ;
	}
};