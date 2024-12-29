;(function ($) {
  const BASE_PRICE = 5.99
  const BASE_PRICE05 = 4.79
  const BASE_PRICE02 = 4.5
  const state = {
    nick: null,
    total: 0,
    items: [],
  }
  let index
  const shapes = {
    rectangle: 'Prostokąt',
    square: 'Kwadrat',
    circle: 'Okrąg',
  }

  $('.calc-container').on('click', '.calc-shape li', function () {
    const shape = this.dataset.shape
    const calcItem = this.closest('.calc-item')

    calcItem
      .querySelector('.calc-shape-' + shape)
      .classList.remove('calc-shape-diabled')

    state.items.push({
      id: calcItem.id,
      shape,
      width: 0,
      height: 0,
      edges: null,
      corners: null,
      quantity: 1,
      price: 0,
	  thick: 7,
	  pieces: 0,
    })

    this.closest('.calc-shape-select').style.display = 'none'
  })

  function resetCalc(item) {
    const activeItem = item.querySelector(
      '.calc-shape-form:not(.calc-shape-diabled)'
    )
    const calcInputs = item.querySelectorAll('.calc-input')
    const quantityInputs = item.querySelectorAll('.calc-input.calc-quantity')

    if (activeItem) {
      activeItem.classList.add('calc-shape-diabled')
    }

    calcInputs.forEach((input) => {
      input.value = ''
    })

    quantityInputs.forEach((input) => {
      input.value = 1
    })

    item.querySelectorAll('.price').forEach((price) => {
      price.classList.add('price-hidden')
      price.innerHTML = ''
    })
    item.querySelector('.calc-shape-select').style.display = 'block'
  }

  function hideBottomBar() {
    const calcItems = document.querySelectorAll('.calc-item')

    document.querySelector('.buttons-panel').classList.add('calc-hidden')
  }

  function showBottomBar() {
    document.querySelector('.buttons-panel').classList.remove('calc-hidden')
  }

  $('.calc-container').on('click', '.change-shape', function () {
    resetCalc(this.closest('.calc-item'))
    hideBottomBar()
  })

  $('.calc-nextitem').click(function () {
    const calcItems = document.querySelectorAll('.calc-item')
    const clone = calcItems[calcItems.length - 1].cloneNode(true)
    clone.id = 'calc-item' + (calcItems.length + 1)

    document.getElementById('calcAll').appendChild(clone)
    resetCalc(clone)
  })

  $('.calc-container').on('click', '.calc-delete', function () {
    const parent = $(this).parent()

    parent.remove()
    updateState(parent.attr('id'))
  })

  $('.copythis-btn').click(function () {
    var range = document.createRange()
    range.selectNode(document.getElementById('copythistxt'))
    window.getSelection().removeAllRanges() // clear current selection
    window.getSelection().addRange(range) // to select text
    document.execCommand('copy')
    window.getSelection().removeAllRanges() // to deselect
    $('#copythis-check').removeClass('copythis-check-hidden')
    $('#copythis-info').show('slow')
  })

 

  $('.calc-final').click(function () {
	$('#calc-total').removeClass('calc-hidden')
    $('#calcAll').addClass('calc-inactive')
    $('.buttons-panel').addClass('calc-inactive')

    $('html, body').animate(
      { scrollTop: jQuery('#calc-total').offset().top },
      1000
    )

   
	let a = 0
	let b = 0
	let quantities = 0
	let p = 0
	
	for (let i = 0; i <= index; i++){
		a += state.items[i].width
		b += state.items[i].height
		quantities += state.items[i].quantity
		p += state.items[i].pieces
	}
	
	
    const allPieces = p
	
	if (allPieces.toFixed() == 1) {var szt = 'sztukę'} else if ((allPieces.toFixed() > 1) && (allPieces.toFixed() < 5)) {var szt = "sztuki"} else {var szt = 'sztuk'}
    document.querySelector('.summary-quantity').innerHTML =
      allPieces.toFixed() + ' ' + szt
    document.querySelector('.summary-price').innerHTML = state.total.toFixed(2)
    document.querySelector('.summary-text-to-copy').innerHTML = buildCopyText()
  })

  $('.login-change').click(function () {
    $('#calc-total').addClass('calc-hidden')
    $('#calcAll').removeClass('calc-inactive')
    $('.buttons-panel').removeClass('calc-inactive')
    $('html, body').animate(
      { scrollTop: jQuery('#calcAll').offset().top },
      1000
    )
  })

  $('.calc-container').on('paste input change', 'input, select', function () {
    let calcItem = this.closest('.calc-item')

    if (!calcItem) return

    let priceElement = calcItem.querySelector(
      '.calc-shape-form:not(.calc-shape-diabled) .price'
    )

    console.log(state)

    const numberInputs = Array.from(
      calcItem.querySelectorAll(
        '.calc-shape-form:not(.calc-shape-diabled) input[type=number]'
      )
    )

    if (
      numberInputs.some((input) => input.value === '' || !input.validity.valid)
    ) {
      priceElement.classList.add('price-hidden')
      hideBottomBar()
      return
    }

    showBottomBar()

    const width = Number(
      numberInputs.find((input) => input.dataset.attribute === 'width')?.value
    )

    let height = Number(
      numberInputs.find((input) => input.dataset.attribute === 'height')?.value
    )

    if (!height) height = width

    const edges = calcItem.querySelector(
      '.calc-shape-form:not(.calc-shape-diabled) .calc-edges'
    )?.value

    const corners = calcItem.querySelector(
      '.calc-shape-form:not(.calc-shape-diabled) .calc-corners'
    )?.value
	
	const thickness = calcItem.querySelector(
      '.calc-shape-form:not(.calc-shape-diabled) .calc-thick'
    )?.value
	

	const quantity = Number(
		numberInputs.find((input) => input.dataset.attribute === 'quantity')?.value
		);

	let price;

	if (thickness == 7) {
	  price = (Math.ceil((height * width) / 1000) * BASE_PRICE) * quantity;
	} else if (thickness == 5) {
	  price = (Math.ceil((height * width) / 1000) * BASE_PRICE05) * quantity;
	} else {
	  price = (Math.ceil((height * width) / 1000) * BASE_PRICE02) * quantity;
	}

	const pieces = (Math.ceil((height * width) / 1000)) * quantity;
	
    priceElement.innerHTML = 'Ilość sztuk do kupienia: '+ pieces.toFixed() + ' Cena: ' + price.toFixed(2) + ' zł'
    priceElement.dataset.value = price.toFixed(2)
    priceElement.classList.remove('price-hidden')

    updateState(calcItem.id, width, height, edges, corners, quantity, price, thickness, pieces)
	let a = 0
	let b = 0
	let quantities = 0
	let p = 0
	
	for (let i = 0; i <= index; i++){
		a += state.items[i].width
		b += state.items[i].height
		quantities += state.items[i].quantity
		p += state.items[i].pieces
	}
	
    const allPieces = p
    document.querySelector('.price-total span').innerHTML =
      state.total.toFixed(2) + ' zł' + ' Ilosc sztuk: '+ allPieces
  })

  function updateState(id, width, height, edges, corners, quantity, price, thickness, pieces) {
    let item = state.items.find((i) => i.id === id)
    index = state.items.indexOf(item)
    const prices = document.querySelectorAll('.price:not(.price-hidden)')
	
    if (arguments.length === 1 && index > -1) {
      state.items.splice(index, 1)

      return
    }

    item = { ...item, width, height, edges, corners, quantity, price, thickness, pieces}
    state.items[index] = item

    state.total = 0
    prices.forEach((price) => {
      state.total = state.total + Number(price.dataset.value)
    })
  }

  function buildCopyText() {
    let result = ''
    state.items.forEach((item, key) => {
      if (item.width === 0) return

    let text = '' 
	if (key > 0) text +=  '|'
    text += item.quantity + '_SZT'
	text += item.edges + '-'
	text += item.thickness + '-'
    text += item.width * 10
	if (shapes[item.shape] !== 'Okrąg') text += 'X' + item.height * 10
	if (shapes[item.shape] == 'Okrąg') text += 'R'

      

      if ((item.corners > 0) && (shapes[item.shape] !== 'Okrąg')) text += '-R' + item.corners + ' '

	
      

      result += text
    })

    return result
  }
})(jQuery)