type Config = {
	host: string;
	i: string;
	master?: string;
	wsUrl: string;
	apiUrl: string;
	keywordEnabled: boolean;
	notingEnabled: boolean;
	serverMonitoring: boolean;
	mecab?: string;
	mecabDic?: string;
	memoryDir?: string;
	shellgeiUrl: string;
};

const config = require('../config.json');

config.wsUrl = config.host.replace('http', 'ws');
config.apiUrl = config.host + '/api';

export default config as Config;
