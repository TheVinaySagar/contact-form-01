(function($) {
	"use strict";
  
	// Form
	var contactForm = function() {
	  if ($('#contactForm').length > 0 ) {
		$( "#contactForm" ).validate({
		  rules: {
			name: "required",
			subject: "required",
			email: {
			  required: true,
			  email: true
			},
			message: {
			  required: true,
			  minlength: 5
			}
		  },
		  messages: {
			name: "Please enter your name",
			subject: "Please enter your subject",
			email: "Please enter a valid email address",
			message: "Please enter a message"
		  },
		  
		  submitHandler: function(form) {    
			var $submit = $('.submitting'),
			  waitText = 'Submitting...';
  
			$submit.prop('disabled', true);
  
			const formData = {
			  name: $('#name').val(),
			  email: $('#email').val(),
			  subject: $('#subject').val(),
			  message: $('#message').val()
			};
  
			fetch('/send-email', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify(formData),
			})
			.then(response => response.json())
			.then(data => {
			  if (data.status === 'success') {
				$('#form-message-warning').hide();
				setTimeout(function(){
				  $('#contactForm').fadeIn();
				}, 1000);
				setTimeout(function(){
				  $('#form-message-success').fadeIn();   
				}, 1400);
				setTimeout(function(){
				  $('#form-message-success').fadeOut();   
				}, 8000);
				setTimeout(function(){
				  $submit.css('display', 'none').text(waitText);  
				}, 1400);
				setTimeout(function(){
				  form.reset();
				}, 1400);
			  } else {
				$('#form-message-warning').html(data.message);
				$('#form-message-warning').fadeIn();
				$submit.css('display', 'none');
			  }
			  $submit.prop('disabled', false);
			})
			.catch(error => {
			  console.error('Error:', error);
			  $('#form-message-warning').html("Something went wrong. Please try again.");
			  $('#form-message-warning').fadeIn();
			  $submit.css('display', 'none');
			  $submit.prop('disabled', false);
			});
			
			return false;
		  }
		});
	  }
	};
	contactForm();
  
  })(jQuery);