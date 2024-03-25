$(document).ready(function () {
  let loggedInUsername = "";
  let isLoggedIn = false;
  let saldo = 0;
  let totalIncome = 0;
  let totalOutcome = 0;
  const transactions = [];

  function showPage(pageId) {
    $(".page").addClass("hidden");
    $(pageId).removeClass("hidden");
  }

  $("#login-nav").click(function () {
    showPage("#login");
  });

  $("#main-nav").click(function () {
    showPage("#main");
  });

  $("#income-nav").click(function () {
    showPage("#income");
  });

  $("#outcome-nav").click(function () {
    showPage("#outcome");
  });

  $("#about-nav").click(function () {
    showPage("#about");
  });

  $("#login-form").submit(function (event) {
    event.preventDefault();
    loggedInUsername = $("#username").val();
    $("#login-nav").text(loggedInUsername);
    isLoggedIn = true;
    showPage("#main");

    Swal.fire({
      icon: "success",
      title: "Login Successful!",
      text: `Welcome, ${loggedInUsername}!`,
      showConfirmButton: false,
      timer: 2000,
    });
  });

  $("nav").hide();

  function updateNavbar() {
    if (isLoggedIn) {
      $("#login-nav").text(loggedInUsername);
      $("#login-nav").click(function () {
        showPage("#profile");
      });
    } else {
      $("#login-nav").text("Login");
      $("#login-nav").click(function () {
        showPage("#login");
      });
    }
  }

  $("#login-form").submit(function (event) {
    event.preventDefault();

    isLoggedIn = true;
    loggedInUsername = $("#username").val();
    updateNavbar();
    showPage("#main");
    $("nav").show();
  });

  $("#change-name-form").submit(function (event) {
    event.preventDefault();
    const newUsername = $("#new-username").val();
    loggedInUsername = newUsername;
    updateNavbar();
    showPage("#main");

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Nama pengguna berhasil diubah.",
    });
  });

  function updateSaldo() {
    $("#saldo").text("Rp." + saldo);
  }

  function updateTotalIncome() {
    $("#total-income").text("+Rp." + totalIncome);
  }

  function updateTotalOutcome() {
    $("#total-outcome").text("-Rp." + totalOutcome);
  }

  function renderTransactions() {
    const transactionList = $("#transactions");
    transactionList.empty();

    transactions.forEach((transaction) => {
      const listItem = $("<li>").addClass("list-group-item");
      const transactionInfo = $("<div>")
        .addClass("transaction-info")
        .css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          textAlign: "left",
        });

      transactionInfo.append(
        `<div style="text-align: left;"><h5>${transaction.nama}</h5><span>${transaction.tanggal}</span><p>${transaction.kategori}</p></div>`
      );

      const amountSpan = $("<span>").text(`Rp.${transaction.jumlah}`);
      if (transaction.jenis === "income") {
        amountSpan.css("color", "green");
      } else if (transaction.jenis === "outcome") {
        amountSpan.css("color", "red");
      }
      transactionInfo.append(amountSpan);

      listItem.append(transactionInfo);
      transactionList.append(listItem);
    });

    transactionList.css({
      maxHeight: "300px",
      overflowY: "auto",
    });
  }

  $("#income-form").submit(function (event) {
    event.preventDefault();

    const nama = $("#income-nama").val();
    const jumlah = parseInt($("#income-jumlah").val());
    const kategori = $("#income-kategori").val();
    const tanggal = $("#income-tanggal").val();

    const transaction = {
      nama,
      jumlah,
      kategori,
      jenis: "income",
      tanggal,
    };
    transactions.push(transaction);
    saldo += jumlah;
    totalIncome += jumlah;

    updateSaldo();
    updateTotalIncome();
    renderTransactions();
    $("#income-form").trigger("reset");

    Swal.fire({
      icon: "success",
      title: "Saldo Bertambah!",
      text: `Saldo bertambah sebesar Rp.${jumlah}.`,
    });
  });

  $("#outcome-form").submit(function (event) {
    event.preventDefault();

    const nama = $("#outcome-nama").val();
    const jumlah = parseInt($("#outcome-jumlah").val());
    const kategori = $("#outcome-kategori").val();
    const tanggal = $("#outcome-tanggal").val();

    if (jumlah > saldo) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Saldo tidak mencukupi untuk transaksi ini.",
      });
      return;
    }

    const transaction = {
      nama,
      jumlah,
      kategori,
      jenis: "outcome",
      tanggal,
    };
    transactions.push(transaction);
    saldo -= jumlah;
    totalOutcome += jumlah;

    updateSaldo();
    updateTotalOutcome();
    renderTransactions();
    $("#outcome-form").trigger("reset");

    Swal.fire({
      icon: "success",
      title: "Saldo Berkurang!",
      text: `Saldo berkurang sebesar Rp.${jumlah}.`,
    });
  });
});
