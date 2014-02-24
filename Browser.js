
query = location.toString().split('?')[1];
params = query ? query.delimObject('&', '=') : null;
