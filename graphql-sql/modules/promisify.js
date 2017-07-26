module.exports = (func, context = null) => (...props) => {
	return new Promise((resolve, reject) => {
		func.call(context, ...props, (...props2) => {
			if (props2.length === 0) {
				resolve();
			} else if(props2.length === 1) {
				try {
					resolve(props2[0]);
				} catch (err) {
					reject(err);
				}
			} else {
				let [err, result] = props2;
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			}
		});
	});
};