//AJAX Call
//Add watchlist
$("#table_id tbody").on('click', '.btn-watchList', function () {
    Swal.fire({
        title: 'Add ' + $(this).attr("data-symbol") + ' to watchlist?',
        text: 'Add ' + $(this).attr("data-symbol") + ' at ' + $(this).attr("data-price") + ' $',
        icon: 'none',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Add'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "/dashboard/watchlist_add",
                type: "post",
                data: {
                    crypto_symbol: $(this).attr("data-symbol"),
                    crypto_name: $(this).attr("data-coin"),
                    user_id: $(this).attr("data-user_id")
                },
                success: function (result) {
                    if (result) {

                        Swal.fire(
                            'Done!',
                            $(this).attr("data-symbol") + ' Added to watchlist.',
                            'success'
                        )
                    }
                }.bind(this)
            })

        }
    })
})
//Delete watchlist
$("#table_watchlist tbody").on('click', '.btn-delete-watchlist', function () {
    let id = $(this).attr("data-watchlist_id");
    swal.fire({
        title: 'Are you sure you want to delete ' + $(this).attr("data-symbol") + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "watchlist/delete",
                type: "delete",
                data: {
                    watchlist_id: $(this).attr("data-watchlist_id"),
                },
                success: function (result) {
                    if (result) {

                        $("#" + id).remove();
                        Swal.fire(
                            result
                        )
                    }
                }.bind(this)
            })
        }
    })
});

//Add to porfolio(Buy coin)
$("#table_watchlist,#table_id tbody").on('click', '.btn-buy', function () {

    let coinPrice = parseFloat(getCoinPrice($(this).attr("data-coin_name"))).toFixed(2);
    console.log(coinPrice);

    Swal.fire({
        title: 'Buy ' + $(this).attr("data-symbol") + ' ?',
        text: 'Buy ' + $(this).attr("data-symbol") + ' at ' + coinPrice + ' $',
        input: 'number',
        showCancelButton: true,
        confirmButtonText: 'Buy',
        confirmButtonColor: "#17A673",
        showLoaderOnConfirm: true,
        inputAttributes: {
            min: 1
        },
        preConfirm: (amount) => {
            if (!amount) {
                return false
            } else {
                return amount
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.value) {

            $.ajax({
                url: "/dashboard/portfolio/buy",
                type: "post",
                data: {
                    user_id: $(this).attr("data-user_id"),
                    crypto_symbol: $(this).attr("data-symbol"),
                    crypto_name: $(this).attr("data-coin_name"),
                    amount: result.value
                },
                success: function (data) {
                    if (data) {
                        if (data.error) {
                            Swal.fire({
                                icon: 'error',
                                title: data.error,
                                text: 'Your account balance is insufficient to make the current call',
                            })
                        } else {

                            Swal.fire(
                                'Done!',
                                data.data.symbol + ' Added to Portfolio.',
                                'success'
                            )
                        }

                    }
                }.bind(this)
            })
        }
    })
})


getCoinPrice = function (coin) {
    var obj;
    $.ajax({
        async: false,
        type: "GET",
        url: 'https://api.coincap.io/v2/assets/' + coin,
        dataType: 'json',
        success: function (data) {
            obj = data;
        },
        error: function () {
            alert('Error occured');
        }
    });
    return obj.data.priceUsd;
}

// //Update Current User Ballance
// $.ajax({
//     url: "/dashboard/updateBallance",
//     type: "get",
//     success: function (result) {

//     }
// })

//Sell Coin
$("#table_portfolio").on('click', '.btn-sell', function () {
    let id = $(this).attr("data-position_id");
    let coinPrice = parseFloat(getCoinPrice($(this).attr("data-coin_name"))).toFixed(2);
    console.log(coinPrice);
    Swal.fire({
        title: 'Sell ' + $(this).attr("data-symbol") + ' ?',
        text: 'Sell ' + $(this).attr("data-symbol") + ' at ' + coinPrice + ' $',
        input: 'number',
        showCancelButton: true,
        confirmButtonText: 'Sell',
        confirmButtonColor: "#17A673",
        showLoaderOnConfirm: true,
        inputAttributes: {
            min: 1,
            max: $(this).attr("data-amount")
        },
        preConfirm: (amount) => {
            if (!amount) {
                return false
            } else {
                return amount
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "/dashboard/portfolio/sell",
                type: "post",
                data: {
                    user_id: $(this).attr("data-user_id"),
                    position_id: $(this).attr("data-position_id"),
                    crypto_symbol: $(this).attr("data-symbol"),
                    crypto_name: $(this).attr("data-coin_name"),
                    amount: result.value
                },
                success: function (data) {
                    if (data) {
                        if (data.error) {
                            console.log(data.error)
                        } else {
                            Swal.fire(
                                'Done!',
                                data.symbol + ' Sold.',
                                'success'
                            )
                            if (data.remove) {
                                $("#" + id).remove();
                            }
                        }
                    }
                }.bind(this)
            })
        }
    })
})

$(".change_profile_img").click(() => {
    alert("Test")
})

$('#table_id').on('click', 'tbody tr', function (e) {
    //Check if clicked tr is not button(there is button inside tr that makes other oparations)
    if (e.target.nodeName !== 'BUTTON') {
        console.log($(this).attr('data-coin'))
        window.location.href = "/dashboard/chart?coin=" + $(this).attr('data-coin');
    }
});

//Delete Blog Post
$(".deletPost").on("click", function () {
    let id = $(this).attr("data-postId");
    swal.fire({
        title: 'Are you sure you want to delete your post?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "blog/delete",
                type: "delete",
                data: {
                    post_id: $(this).attr("data-postId"),
                },
                success: function (result) {
                    if (result) {
                        $("#" + id).remove();
                        Swal.fire(
                            result
                        )
                    }
                }.bind(this)
            })
        }
    })
})