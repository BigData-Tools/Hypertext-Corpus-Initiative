domino.settings({
    shortcutPrefix: "::" // Hack: preventing a bug related to a port in a URL for Ajax
    ,verbose: true
})

;(function($, domino, dmod, undefined){
    
    // Check that config is OK
    if(HYPHE_CONFIG === undefined)
        alert('Your installation of Hyphe has no configuration.\nCreate a file at "_config/config.js" in the same directory than index.php, with at least this content:\n\nHYPHE_CONFIG = {\n"SERVER_ADDRESS":"http://YOUR_RPC_ENDPOINT_URL"\n}')

    // Stuff we reuse often when we initialize Domino
    var rpc_url = HYPHE_CONFIG.SERVER_ADDRESS
        ,rpc_contentType = 'application/x-www-form-urlencoded'
        ,rpc_type = 'POST'
        ,rpc_expect = function(data){return data[0] !== undefined && data[0].code !== undefined && data[0].code == 'success'}
        ,rpc_error = function(data){alert('Oops, an error occurred... \n'+data)}

    var D = new domino({
        name: 'main'
        ,properties: [
            {
                id:'webentities'
                ,dispatch: 'webentities_updated'
                ,triggers: 'update_webentities'
            },{
                id:'currentWebentity'
                ,dispatch: 'currentWebentity_updated'
                ,triggers: 'update_currentWebentity'
            },{
                id:'webentitiesselectorDisabled'
                ,dispatch: 'webentitiesselectorDisabled_updated'
                ,triggers: 'update_webentitiesselectorDisabled'
                ,type:'boolean'
                ,value:true
            },{
                id:'urldeclarationInvalid'
                ,dispatch: 'urldeclarationInvalid_updated'
                ,triggers: 'update_urldeclarationInvalid'
                ,type:'boolean'
                ,value:true
            },{
                id:'hidePrefixes'
                ,dispatch: 'hidePrefixes_updated'
                ,triggers: 'update_hidePrefixes'
                ,type:'boolean'
                ,value:true
            },{
                id:'startpagesMessageObject'
                ,dispatch: 'startpagesMessageObject_updated'
                ,triggers: 'update_startpagesMessageObject'
                ,value: {display: false}
            },{
                id:'addstartpageValidation'
                ,dispatch: 'addstartpageValidation_updated'
                ,triggers: 'update_addstartpageValidation'
                
            },{
                id:'removestartpageValidation'
                ,dispatch: 'removestartpageValidation_updated'
                ,triggers: 'update_removestartpageValidation'
                
            },{
                id:'lookedupUrl'
                ,dispatch: 'lookedupUrl_updated'
                ,triggers: 'update_lookedupUrl'
                
            },{
                id:'urllookupValidation'
                ,dispatch: 'urllookupValidation_updated'
                ,triggers: 'update_urllookupValidation'
            },{
                id:'crawlsettingsInvalid'
                ,dispatch: 'crawlsettingsInvalid_updated'
                ,triggers: ['update_crawlsettingsInvalid', 'update_crawlLaunchState']
                ,type:'boolean'
                ,value:true
            },{
                id:'launchcrawlMessageObject'
                ,dispatch: 'launchcrawlMessageObject_updated'
                ,triggers: ['update_launchcrawlMessageObject', 'update_crawlLaunchState']
                ,value: {html:'You must <strong>pick a web entity</strong> or declare a new one', bsClass:'alert-info', display: true}
            },{
                id:'crawlValidation'
                ,dispatch: 'crawlValidation_updated'
                ,triggers: 'update_crawlValidation'
            }
        ]


        ,services: [
            {
                id: 'getWebentities'
                ,setter: 'webentities'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.WEBENTITIES.GET,
                        'params' : [],
                    })}
                ,path:'0.result'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            },{
                id: 'getCurrentWebentity'
                ,setter: 'currentWebentity'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.WEBENTITIES.GET,
                        'params' : [
                            [settings.currentWebentityId]    // List of web entities ids
                        ],
                    })}
                ,path:'0.result.0'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            },{
                id: 'declarePage'
                ,setter: 'currentWebentity'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.PAGE.DECLARE,
                        'params' : [settings.url],
                    })}
                ,path:'0.result'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            },{
                id: 'addStartPage'
                ,setter: 'addstartpageValidation'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.WEBENTITY.STARTPAGE.ADD,
                        'params' : [
                            settings.webentityId
                            ,settings.url
                        ],
                    })}
                ,path:'0.result'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            },{
                id: 'removeStartPage'
                ,setter: 'removestartpageValidation'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.WEBENTITY.STARTPAGE.REMOVE,
                        'params' : [
                            settings.webentityId
                            ,settings.url
                        ],
                    })}
                ,path:'0.result'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            },{
                id: 'urlLookup'
                ,setter: 'urllookupValidation'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.URL_LOOKUP,
                        'params' : [
                            settings.url
                            ,settings.timeout
                        ],
                    })}
                ,path:'0.result'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            },{
                id: 'crawl'
                ,setter: 'crawlValidation'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.WEBENTITY.CRAWL,
                        'params' : [
                            settings.webentityId
                            ,settings.maxDepth
                        ],
                    })}
                ,path:'0.result'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            }
        ]


        ,hacks:[
            {
                // Enable the selector when the web entities are updated
                triggers: ['webentities_updated']
                ,method: function(){
                    D.dispatchEvent('update_webentitiesselectorDisabled', {
                        webentitiesselectorDisabled: false
                    })
                }
            },{
                // On web entity selected in UI, update current web entity
                triggers: ['ui_webentitySelected']
                ,method: function(){
                    var current_we_id = $('#webentities_selector').val()
                        ,current_we
                        ,webentities = D.get('webentities')
                    webentities.forEach(function(we){
                        if(we.id == current_we_id)
                            current_we = we
                    })
                    D.dispatchEvent('update_currentWebentity', {
                        currentWebentity: current_we
                    })
                }
            },{
                // On web entity declared in UI (by URL pasted), declare a page
                triggers: ['ui_webentityDeclared']
                ,method: function(){
                    if(!D.get('urldeclarationInvalid')){
                        D.request('declarePage', {
                            url: $('#urlField').val()
                        })
                    }
                }
            },{
                // Selecting a web entity show the prefixes
                triggers: ['currentWebentity_updated']
                ,method: function(){
                    D.dispatchEvent('update_hidePrefixes', {
                        hidePrefixes: false
                    })
                }
            },{
                // Start page message hidden when a new web entity is selected or declared
                triggers: ['ui_webentitySelected', 'ui_webentityDeclared']
                ,method: function(){
                    D.dispatchEvent('update_startpagesMessageObject', {
                        startpagesMessageObject: {text:'', display:false, bsClass:'', }
                    })
                }
            },{
                // Start page message displayed when clicking on "Use prefixes as start pages"
                triggers: ['ui_usePrefixesAsStartPages']
                ,method: function(){
                    D.dispatchEvent('update_startpagesMessageObject', {
                        startpagesMessageObject: {text:'Use prefixes as start pages...', display:true, bsClass:'alert-info', }
                    })
                }
            },{
                // Start page message displayed when one or more start pages added
                triggers: ['addstartpageValidation_updated']
                ,method: function(){
                    D.dispatchEvent('update_startpagesMessageObject', {
                        startpagesMessageObject: {text:'Start page(s) added', display:true, bsClass:'alert-success', }
                    })
                }
            },{
                // Start page message displayed when pages removed
                triggers: ['removestartpageValidation_updated']
                ,method: function(){
                    D.dispatchEvent('update_startpagesMessageObject', {
                        startpagesMessageObject: {text:'Start page removed', display:true, bsClass:'alert-success', }
                    })
                }
            },{
                // Clicking on "Use prefixes as start pages" triggers a remote action
                triggers: ['ui_usePrefixesAsStartPages']
                ,method: function(){
                    var we = D.get('currentWebentity')
                    if(we !== undefined){
                        we.lru_prefixes.forEach(function(lru_prefix){
                            D.request('addStartPage', {
                                webentityId: we.id
                                ,url: Utils.LRU_to_URL(lru_prefix)
                            })
                        })
                    }
                }
            },{
                // If the start pages are modified, reload the current web entity
                triggers: ['addstartpageValidation_updated', 'removestartpageValidation_updated']
                ,method: function(){
                    var we = D.get('currentWebentity')
                    if(we !== undefined)
                        D.request('getCurrentWebentity', {currentWebentityId: we.id})
                }
            },{
                // On URL lookup demanded, store the URL and do the lookup
                triggers: ['lookupUrl']
                ,method: function(d){
                    D.dispatchEvent('update_lookedupUrl', {
                        lookedupUrl: d.data.url
                    })
                    D.request('urlLookup', {
                        url: d.data.url
                        ,timeout: 5
                    })
                }
            },{
                // On 'add start page' button clicked, validate
                triggers: ['ui_addStartpage']
                ,method: function(){
                    var url = $('#startPages_urlInput').val()
                    if(url=='' || url === undefined){                           // No start page: do nothing
                    } else if(!Utils.URL_validate(url)){                        // The URL is invalid: display a message
                        D.dispatchEvent('update_startpagesMessageObject', {
                            startpagesMessageObject: {html:'<strong>Invalid URL.</strong> This string is not recognized as an URL. Check that it begins with "http://".', display:true, bsClass:'alert-error', }
                        })
                    } else {                                                    // Check that the start page is in one of the LRU prefixes
                        var lru = Utils.URL_to_LRU(url)
                            ,lru_valid = false
                            ,we = D.get('currentWebentity')
                        we.lru_prefixes.forEach(function(lru_prefix){
                            if(lru.indexOf(lru_prefix) == 0)
                                lru_valid = true
                        })
                        if(!lru_valid){                                         // The start page does not belong to any LRU_prefix: display message
                            D.dispatchEvent('update_startpagesMessageObject', {
                                startpagesMessageObject: {html:'<strong>Invalid start page.</strong> This page does not belong to the web entity (check the prefixes).', display:true, bsClass:'alert-error', }
                            })
                        } else {                                                // It's OK: display a message and request the service
                            D.dispatchEvent('update_startpagesMessageObject', {
                                startpagesMessageObject: {text:'Adding the start page...', display:true, bsClass:'alert-info', }
                            })
                            D.request('addStartPage', {
                                webentityId: we.id
                                ,url: url
                            })
                        }
                    }
                }
            },{
                // On 'remove start page' clicked, display message and request the service
                triggers: ['ui_removeStartPage']
                ,method: function (d) {
                    D.dispatchEvent('update_startpagesMessageObject', {
                        startpagesMessageObject: {text:'Removing the start page...', display:true, bsClass:'alert-info', }
                    })
                    we = D.get('currentWebentity')
                    D.request('removeStartPage', {
                        webentityId: we.id
                        ,url: d.data.url
                    })
                }
            },{
                // Each time the settings change, test if the crawl can ben launched or not.
                // We dispatch the state of the launch button and the message.
                triggers: ['currentWebentity_updated', 'startpagesChecked', 'ui_depthChange']
                ,method: function(){
                    var we = D.get('currentWebentity')
                    if(we === undefined){
                        // No web entity selected
                        D.dispatchEvent('update_crawlLaunchState', {
                            launchcrawlMessageObject: {html:'You must <strong>pick a web entity</strong> or declare a new one', bsClass:'alert-info', display: true}
                            ,crawlsettingsInvalid: true
                        })
                    } else {
                        if(we.startpages === undefined || we.startpages.length == 0){
                            // There is a web entity but there are no starting pages
                            D.dispatchEvent('update_crawlLaunchState', {
                                launchcrawlMessageObject: {html:'<strong>No start page.</strong> You must define on which page the crawler will start', bsClass:'alert-error', display: true}
                                ,crawlsettingsInvalid: true
                            })
                        } else {
                            if($('.startPage_tr td a.unchecked').length > 0){
                                // Waiting for start pages validation
                                D.dispatchEvent('update_crawlLaunchState', {
                                    launchcrawlMessageObject: {text:'Waiting for start pages validation...', bsClass:'alert-info', display: true}
                                    ,crawlsettingsInvalid: true
                                })
                            } else if($('.startPage_tr td a.invalid').length > 0){
                                // There are some invalid start pages
                                D.dispatchEvent('update_crawlLaunchState', {
                                    launchcrawlMessageObject: {html:'<strong>Invalid start pages.</strong> Please check that start pages are not redirected and are actually working.', bsClass:'alert-warning', display: true}
                                    ,crawlsettingsInvalid: true
                                })
                            } else {
                                // There is a web entity and it has valid start pages
                                var maxdepth = $('#depth').val()
                                if(!Utils.checkforInteger(maxdepth)){
                                    // The depth is not an integer
                                    D.dispatchEvent('update_crawlLaunchState', {
                                        launchcrawlMessageObject: {html:'<strong>Wrong depth.</strong> The maximum depth must be an integer', bsClass:'alert-error', display: true}
                                        ,crawlsettingsInvalid: true
                                    })
                                } else {
                                    // Everything's OK !
                                    D.dispatchEvent('update_crawlLaunchState', {
                                        launchcrawlMessageObject: {display: false}
                                        ,crawlsettingsInvalid: false
                                    })
                                }
                            }
                        }
                    }
                }
            },{
                // Launch crawl on event
                triggers:['ui_launchCrawl']
                ,method: function(){
                    var we = D.get('currentWebentity')
                        ,maxdepth = $('#depth').val()
                    if(we !== undefined && Utils.checkforInteger(maxdepth)){
                        D.request('crawl', {
                            webentityId: we.id
                            ,maxDepth: maxdepth
                        })
                    }
                }
            },{
                // Redirection on crawl launched
                triggers:['crawlValidation_updated']
                ,method:function(){
                    window.location = "crawl.php"
                }
            }
        ]
    })



    //// Modules

    // Selector of web entities
    D.addModule(dmod.Selector_bigList, [{
        element: $('#webentities_selector')
        ,placeholder: 'Select an existing web entity'
        ,data_property: 'webentities'
        ,item_wrap: function(webEntity){
            return {id:webEntity.id, text:webEntity.name}
        }
        ,disabled_property: 'webentitiesselectorDisabled'
        ,selected_property: 'currentWebentity'
        ,dispatch: 'ui_webentitySelected'
    }])

    // Button for webentity declaration
    D.addModule(dmod.Button, [{
        element: $('#webEntityByURL_button')
        ,disabled_property: 'urldeclarationInvalid'
        ,dispatch: 'ui_webentityDeclared'
    }])

    // Input for web entity declaration
    D.addModule(function(){
        domino.module.call(this)

        var element = $('#urlField')

        element.on('keyup', function(e){
            if(e.keyCode == 13){
                // Enter key pressed
                if(!D.get('urldeclarationInvalid')){
                    D.dispatchEvent('ui_webentityDeclared', {})
                    element.blur()
                }
            } else {
                var url = element.val()
                // Validation
                D.dispatchEvent('update_urldeclarationInvalid', {
                    urldeclarationInvalid: !Utils.URL_validate(url)
                })
            }
        })
    })

    // Web entity names
    D.addModule(dmod.TextContent, [{
        element: $('span[data-text-content="webentity_name"]')
        ,property: 'currentWebentity'
        ,property_wrap: function(we){return we.name}
        ,triggers: 'currentWebentity_updated'
    }])

    // LRU prefixes
    D.addModule(function(){
        domino.module.call(this)

        var element = $('#webEntities_prefixes')

        this.triggers.events['currentWebentity_updated'] = function(d) {
            var webEntity = d.get('currentWebentity')
            element.html('')
            webEntity.lru_prefixes.forEach(function(lru_prefix){
                element.append(
                    $('<tr/>').append(
                        $('<td/>').text(Utils.LRU_to_URL(lru_prefix))
                    ).append(
                        $('<td>').append(
                            $('<a class="btn btn-link btn-mini pull-right"/>')
                                .attr('href', Utils.LRU_to_URL(lru_prefix))
                                .attr('target', 'blank')
                                .append($('<i class="icon-share-alt"/>'))
                        )
                    )
                )
            })
        }
    })

    // LRU prefixes info
    D.addModule(dmod.HideElement, [{
        element: $('#webEntities_prefixes_info')
        ,property: 'hidePrefixes'
    }])

    // Table of start pages
    D.addModule(function(){
        domino.module.call(this)

        var element = $('#startPagesTable')
            ,messagesElement = $('#startPages_messages')

        this.triggers.events['currentWebentity_updated'] = function(){
            var we = D.get('currentWebentity')
            if(we !== undefined){
                element.html('')
                if(we.startpages.length>0){
                    displayStartpagesList(we.startpages)
                } else {
                    // No start page: propose to import from LRU_prefixes
                    element.append(
                        $('<tr class="startPage_tr"/>').append(
                            $('<td/>').text('No start page')
                        ).append(
                            $('<td/>').append(
                                $('<button class="btn btn-small pull-right">Use prefixes as start pages</button>').click(function(){
                                    D.dispatchEvent('ui_usePrefixesAsStartPages', {})
                                })
                            )
                        )
                    )
                        
                }
                $('#startPages_add').removeClass('disabled')
                $('#startPages_urlInput').removeAttr('disabled')
            } else {
                element.html('<tr><td><span class="muted">Choose a web entity</span></td></tr>')
                $('#startPages_add').addClass('disabled')
                $('#startPages_urlInput').attr('disabled', true)
            }
            startPages_cascadeCheck()
            // TODO: Hyphen.view.launchButton_updateState()
        }

        var displayStartpagesList = function(startpages){
            startpages.forEach(function(sp){
                var tr = $('<tr class="startPage_tr"/>')
                element.append(tr)
                tr.append(
                    $('<td/>').append($('<small/>').append($('<a target="_blank" class="unchecked"/>').attr('href',sp).attr('title',sp).text(Utils.URL_simplify(sp)+' ')))
                )
                if(startpages.length>1){
                    tr.append(
                        $('<td/>').append(
                            $('<button class="close">&times;</button>').click(function(){
                                D.dispatchEvent('ui_removeStartPage', {
                                    url: sp
                                })
                            })
                        )
                    )
                } else {
                    tr.append($('<td/>'))
                }
            })
        }

        var startPages_cascadeCheck = function(){
            var uncheckedElements = $('.startPage_tr td a.unchecked')
            if(uncheckedElements.length > 0){
                var a = $(uncheckedElements[0])
                    ,url = a.attr('href')
                D.dispatchEvent('lookupUrl', {url: url})
            } else {
                D.dispatchEvent('startpagesChecked', {})
            }
        }

        // Lookup result
        this.triggers.events['urllookupValidation_updated'] = function(){
            var status = D.get('urllookupValidation')
                ,url = D.get('lookedupUrl')
                ,candidate = ''

            $('.startPage_tr td a.unchecked').each(function(i,el){
                if(candidate == '' && $(el).attr('href') == url){
                    candidate = $(el)
                }
            })

            if(candidate != ''){
                // We have a valid target for the update
                candidate.removeClass('unchecked')
                if(status==200){
                    // We have a valid URL
                    candidate.parent().parent().parent().addClass('success')
                    candidate.append($('<i class="icon-ok info_tooltip"/>').attr('title', 'Valid start page').tooltip())
                } else if([300, 301, 302].some(function(test){return status==test})){
                    // Redirection
                    candidate.addClass('invalid')
                    candidate.parent().parent().parent().addClass('warning')
                    candidate.append($('<i class="icon-warning-sign info_tooltip"/>').attr('title', 'This page has a <strong>redirection</strong>. Please click on the link and use the right URL.').tooltip())
                } else {
                    // Fail
                    candidate.addClass('invalid')
                    candidate.parent().parent().parent().addClass('error')
                    candidate.append($('<i class="icon-warning-sign info_tooltip"/>').attr('title', '<strong>Invalid page.</strong> This URL has no proper page associated. You must use other start pages.').tooltip())
                }
                startPages_cascadeCheck()
            }
            
        }
    })

    // Start pages info messages
    D.addModule(dmod.TextAlert, [{
        element: $('#startPages_messages')
        ,property: 'startpagesMessageObject'
    }])

    // Input for adding a start page
    D.addModule(function(){
        domino.module.call(this)
        var element = $('#startPages_urlInput')
        element.on('keyup', function(e){
            if(e.keyCode == 13){ // Enter key pressed
                D.dispatchEvent('ui_addStartpage', {})
                element.blur()
            }
        })
        // It has to be cleaned up at some points
        this.triggers.events['addstartpageValidation_updated', 'currentWebentity_updated'] = function(){
            element.val('')
        }
    })

    // Button to add a start page
    D.addModule(dmod.Button, [{
        element: $('#startPages_add')
        ,dispatch: 'ui_addStartpage'
    }])

    // Launch button
    D.addModule(dmod.Button, [{
        element: $('#launchButton')
        ,disabled_property: 'crawlsettingsInvalid'
        ,label: 'Launch crawl'
        ,label_disabled: 'Launch crawl (not ready)'
        ,bsColor: 'btn-primary'
        ,dispatch: 'ui_launchCrawl'
    }])

    // Launch crawl info messages
    D.addModule(dmod.TextAlert, [{
        element: $('#crawlLaunch_messages')
        ,property: 'launchcrawlMessageObject'
    }])

    // Input for the depth
    D.addModule(function(){
        domino.module.call(this)
        var element = $('#depth')
        element.on('keyup', function(e){
            D.dispatchEvent('ui_depthChange', {})
        })
    })

    // Hash and history module
    D.addModule(function(){
        domino.module.call(this)

        // Update hash on web entity selection
        /*this.triggers.events['currentWebentity_updated'] = function(){
            var we = D.get('currentWebentity')
            if(we === undefined)
                Utils.hash.remove('we_id')
            else
                Utils.hash.add({we_id:we.id})
        }*/

        // Update web entity selection by hash, on web entities update (ie. on load)
        this.triggers.events['webentities_updated'] = function(){
            var we_id = Utils.hash.get('we_id')
                ,we = D.get('currentWebentity')
            if(we_id !== undefined && we === undefined){
                var webentities = D.get('webentities')
                    ,we = fetchWebentity_byId(webentities, we_id)
                if(we !== undefined){
                    D.dispatchEvent('update_currentWebentity', {
                        currentWebentity: we
                    })
                }
            }
        }

        // Updating web entity selection on history change
        window.onpopstate = function(event) {
            var we_id = Utils.hash.get('we_id')
            if(we_id && we_id!=''){
                var webentities = D.get('webentities')
                    ,we = fetchWebentity_byId(webentities, we_id)
                if(we !== undefined){
                    D.dispatchEvent('update_currentWebentity', {
                        currentWebentity: we
                    })
                }
            } else {
                // D.dispatchEvent('update_currentWebentity', {
                //     currentWebentity: ''
                // })
            }
        }
    })




    //// On load
    $(document).ready(function(){
        D.request('getWebentities', {})
    })




    /// Processing
    var fetchWebentity_byId = function(webentities, we_id){
        if(webentities !== undefined){
            var matchings = webentities.filter(function(we_candidate){
                    return we_candidate.id == we_id
                })
            if(matchings.length>0){
                return matchings[0]
            }
        }
        return undefined
    }

})(jQuery, domino, (window.dmod = window.dmod || {}))