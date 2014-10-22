function spearalAngularInit(resourceProvider, spearalFactory) {
	
	var defaultHeaders = {
		"Accept": Spearal.APPLICATION_SPEARAL,
		"Content-Type": Spearal.APPLICATION_SPEARAL
	};
	
	function encode(data, headersGetter) {
		if (data) {
			var encoder = spearalFactory.newEncoder();
			encoder.writeAny(data);
			return new Uint8Array(encoder.buffer);
		}
	}

	function decode(arraybuffer, headersGetter) {
		if (arraybuffer && arraybuffer.byteLength > 0) {
			var decoder = spearalFactory.newDecoder(arraybuffer);
			return decoder.readAny();
		}
	}

	var actions = resourceProvider.defaults.actions;
	for (method in actions) {
		var action = actions[method];
		action.responseType = 'arraybuffer';
		action.isArray = false;
		action.transformRequest = [ encode ];
		action.transformResponse = [ decode ];
		action.headers = angular.copy(defaultHeaders);
//		if (method === 'query')
//			action.headers[Spearal.PROPERTY_FILTER_HEADER] = "com.cortez.samples.javaee7angular.data.Person#id,name,description";
	}
}

