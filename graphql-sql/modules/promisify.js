module.exports = (func, context = null) => (...props) => {
	return new Promise((resolve, reject) => {
		func.call(context, ...props, (...props) => {
			if (props.length) {
				resolve();
			} else {
				let [err, result] = props;
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			}
		});
	});
};