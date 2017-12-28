
import $ from 'jquery'

export function NineXAPI(base_url, sign_in_url) {

	return {

		login: function (username, password, onSuccess, onFailure) {
			var LOGIN_URL = "/login"
			// var data = new FormData()
			// data.append('username', username)
			// data.append('password', password)
			$.ajax({
				url: sign_in_url + LOGIN_URL,
				type: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				contentType: "application/x-www-form-urlencoded",
				data: {
					"username": username,
					"password": password,
				},
			})
				.done(onSuccess)
				.fail(onFailure)
		},

		authorize: function (token) {
			var GET_CHANNEL_SHARES_URL = "/channels/{channel_id}/shares?fields=item,created&count=50"
			var GET_CHANNEL = "/channels/{channel_id}"
			var SHARE_TO_CHANNEL = "/channels/{channel_id}/shares"
			var DELETE_SHARE = "/shares/{share_id}"
			var GET_NETWORKS_URL = '/networks'
			return {
				getChannelsList: function (onSuccess, onFailure) {
					$.ajax({
						url: base_url + "/networks/9x/channels",
						type: "GET",
						headers: { "Authorization": token, },
					})
						.done(onSuccess)
						.fail(onFailure)
				},

				getChannelShares: function (channelId, onSuccess, onFailure) {
					$.ajax({
						url: base_url + GET_CHANNEL_SHARES_URL.replace("{channel_id}", channelId),
						type: "GET",
						headers: { "Authorization": token, },
					})
						.done(onSuccess)
						.fail(onFailure)
				},

				getChannel: function (channelId, onSuccess, onFailure) {
					$.ajax({
						url: base_url + GET_CHANNEL.replace("{channel_id}", channelId),
						type: "GET",
						headers: { "Authorization": token, },
					})
						.done(onSuccess)
						.fail(onFailure)
				}
			}
		}
	}

}
