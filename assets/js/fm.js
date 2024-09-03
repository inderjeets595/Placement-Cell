// Check if 'success_flash' is defined and not undefined or empty
if (typeof success_flash !== 'undefined' && success_flash) {
  // Trigger a success notification using iziToast library
  iziToast.success({
      title: 'Success',                       
      message: success_flash,                 
      theme: 'dark',                          
      backgroundColor: '#2E858B',             
      position: 'topRight',                   
      progressBarColor: 'white',            
      transitionInMobile: 'fadeInUp',         
      transitionOutMobile: 'fadeOutUp',      
  });
}

// Check if 'error_flash' is defined and not undefined or empty
if (typeof error_flash !== 'undefined' && error_flash) {
  // Trigger an error notification using iziToast library
  iziToast.error({
      title: 'Error',                     
      message: error_flash,                  
      theme: 'dark',                          
      backgroundColor: '#AA0808',             
      position: 'topRight',                   
      progressBarColor: 'white',             
      transitionInMobile: 'fadeInUp',        
      transitionOutMobile: 'fadeOutUp',       
  });
}

// Check if 'info_flash' is defined and not undefined or empty
if (typeof info_flash !== 'undefined' && info_flash) {
  // Trigger a warning notification using iziToast (even though it's informational, it's displayed as a warning)
  iziToast.warning({
      title: 'Caution',                     
      message: info_flash,                  
      theme: 'dark',                         
      backgroundColor: '#FFB300',            
      position: 'topRight',                  
      progressBarColor: 'white',            
      transitionInMobile: 'fadeInUp',        
      transitionOutMobile: 'fadeOutUp',      
  });
}

// Check if 'warning_flash' is defined and not undefined or empty
if (typeof warning_flash !== 'undefined' && warning_flash) {
  // Trigger an error notification using iziToast, although this is categorized as a warning
  iziToast.error({
      title: 'Error',                     
      message: warning_flash,            
      theme: 'dark',                       
      backgroundColor: '#AA0808',          
      position: 'topRight',                   
      progressBarColor: 'white',              
      transitionInMobile: 'fadeInUp',         
      transitionOutMobile: 'fadeOutUp',       
  });
}
