$(document).ready(function(){
    $('.delete-medal').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/medals/'+id,
            success: function(response){
                alert('Deleting Medal');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});