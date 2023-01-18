export const HELP = {
    'new-cv': {
        title: 'Creating a new CV',
        description:
            `This can be our first move to make when using the app.\nSo the first thing you need to do is to make sure you have all the information you need for the CV you want to create, such as personal data from the Consultant and his/her skill set or experience, although this is not a must.\n\n\nTo begin, just go to <b>Create new CV</b> tab, take a quick look at the form, and fill it in with the information you have.\nNote that there are some required fields you must enter before making a preview or creating the CV. If some of these fields are missing, the app will let you know popping up an error message.\n\n\nThe following are some of the features you will find while creating the document:\n\n\n<b>Profile Picture with Settings<b>\nAfter clicking the profile avatar and uploading the Consultant's profile picture, you can change some of the image settings. You can open this configuration by doing a mouse-over on the picture. You will be able to change position and color values to produce the best result from the image you have.\n\n\n<b>Drag and drop items</b>\nAll the sections that beheaves as a list of items have the possibility to be edited and reorder its content. Try it yourself drag-and-dropping items like in <i>Languages</i> or <i>Skills</i>.\n\n\n<b>Hidden Sections</b>\nWhen you hover over the different sections, dropdowns or inputs, you will see an icon of an eye which represents the hidden status. With this feature you can hide information from the final PDF render. You can see the hidden sections just in Edit or Create view.\nAlso, you can hide entire blocks of information like "Expertise" or "Main Skills". To do this, just click on the minus icon (-) located in the upper-right corner of the block sections.\n\n\n<b>Sintax and Grammar Check</b>\nEvery text input is constantly being checked by a sintax and grammar AI that makes corrections and suggests you on how you can improve the spelling.\n\n\n<b>Canvas Signature</b>\nThis pad can be used to digitally sign "by hand" the document. You can let your Consultant do it later, or just hide it if you don't want to use it.\n\n\n<b>Font Sizes and Margins</b>\nBelow the signature section you'll find a little toolbar from which you can change the font size and external margins from the entire section (Personal Information in this case).\nYou'll find this toolbar in every section that can be seen in the document.\n\n\n<b>Auto-update Skill's Years</b>\nEvery time your CV completes a new year of being created, the time experience of the skills within it will be auto-updated by one year. This means you won't have to worry about doing it yourself. Note that if you edit a skill experience time manually, it will be updated one year after you did the time update.\n\n\n<b>Client Logos</b>\nIn the "Experience" section, it is possible to add a Client/Company Logo for each work experience.\nNote that you can select the Logo from a dropdown or do it mannually (it will be uploaded and will be available for others to use).\n\n\n<b>Highlight Experience</b>\nAfter writing at least two different experiences, you'll have the possibility to re-order as well as hide them. You can make this changes by accessing the sidebar at the right on each experience.\n\n\n<b>Preview Document</b>\nWith this feature, which can be activated by clicking the Preview Button on the bottom of the page, you can see how your document looks so far. If you decide that you're done and you want to export it, you need to save the CV first, then export it from the CV List which can be accessed from the left panel.\n\n\n<b>Footer Information</b>\nHere you can write the information you want to be shown in every document page's footer. You can do it manually or just by choosing a Consultant Manager from the dropdown which will auto-fill the fields with the right information.\nIt is recommended to upload the Consultant Manager data in the <i>Users</i> Section so it can be available for everyone for future uploads.\n\n\n<b>Metadata</b>\nHere is where you can select the CV Type (required) as a Master or Variant. Note that it can be only one Master type of the Consultant's CV in the system and saving Master changes will overwrite all Variants from the same Consultant. There is no creation limit for Variant CVs.\nAlso you can add buzzwords to distinguish the CV among others in search results. These words won't be shown in any view but in edit mode. Additionally, note that the search engine will look for every word within the CV, so you don't need to add words or phrases that already exists in the document.\nThe CV Note was made to make some clarification on why the CV is being created or for any other type of information that can be used for you and others to identify it. The default value will contain your name and the date the document was created.`,
        link: '',
        images: [
            'https://i.postimg.cc/rppnyS72/cv1.png',
            'https://i.postimg.cc/bvMTz4Q1/cv2-2.png',
            'https://i.postimg.cc/sfWn2fHx/cv4.png',
            'https://i.postimg.cc/GpSM4418/cv7.png',
            'https://i.postimg.cc/YqwdLcT3/cv8.png',
            'https://i.postimg.cc/d3GnNnZr/cv9.png',
            'https://i.postimg.cc/SN7DWThp/cv11.png',
            'https://i.postimg.cc/pLWkkfW5/cv12.png',
            'https://i.postimg.cc/tTK2z8J9/cv13.png',
            'https://i.postimg.cc/j57hCvXm/cv16.png',
        ]
    },
    'edit-cv': {
        title: 'Editing a CV',
        description: `It's really difficult to make the perfect CV on the first shot, also you may want to create variations from the one you made to use it in different opportunities.\n\n\nIf you need to make any changes or create variations, just go to the CV you want to work with accessing it from the <b>All CV's</b> or <b>My CV's</b> tab where a table with all the documents you have access is shown. In the <i>actions</i> column you will see the three main paths you can take, one of them is the editing tool.\n\n\nClicking the pencil icon will drive you to the document form where all the CV data will be fetched and from here you will be able to change everything you want.\nThe hidden sections will be visible as well as the document metadata.\n\n\nWhen you're done, you can choose if you want to <b>update</b> the current document or save the changes as a <b>new one</b>, and of course you'll still have the posibility to preview it before you make up your mind.\n\n\nNote that if the CV is a <i>Master Type</i> and you choose to update it, all the variants CVs will be overwritten with the same changes. The idea with this is to cover big updates when you have a lot of variants so you don't have to change one by one. If this is the case, you will be prompted when saving or updating the CV.\n`,
        link: '',
        images: [
            'https://i.postimg.cc/x165ZX8x/cv17.png',
            'https://i.postimg.cc/GpSM4418/cv7.png',
            'https://i.postimg.cc/q7gwHpCk/cv19.png',
        ]
    },
    'restore-items': {
        title: 'Restore a deleted CV or any other item',
        description: `If you accidentally removed a document or you relized that you want to give that item another chance, don't sweat it, you have a <b>Trash</b> module where you can find deleted items such as CV, image, user or any app data that was deleted.\n\n\nFrom here you can choose to recover one of these items or to permanently delete it.\n\n\nThe Trashcan can be found in the app <i>Settings</i>. Just select the module you want to manage from the dropdown.`,
        link: '',
        images: ['https://i.postimg.cc/Dwjwfphc/Screen-Shot-2023-01-18-at-12-03-29-min.png']
    },
    'new-image': {
        title: 'Upload a new image',
        description: `There's a module you can use to manage the images separately from the other sections in the app.\nGo to <i>Settings</i> and then click on the <i>Images</i> tab.\n\n\nYou can upload an image of any type directly from here. The app will analyze and compress it, so it can be easily viewed and downloaded for a better performance.\n\n\nAlso, you can pick an image from the list and edit its entire data. Just note that if you change the email from a Profile Picture, remember to change it on the respective Master CV, so it will still be available to be seen on all the documents attached to that Consultant email.\n`,
        link: '',
        images: [
            'https://i.postimg.cc/c4VzQ1p1/image1.png',
            'https://i.postimg.cc/4NKM7HFF/image2.png',
            'https://i.postimg.cc/6qPmbBT0/image3.png'
        ]
    },
    'image-styling': {
        title: 'Edit image styling',
        description: `If you've already created a CV, you've probably noted that there's a settings panel for the Profile Picture. This panel can be seen in every image of type <i>Profile</i>, and it brings the posibility to edit the image style by changing its position parameters or managing color and light.\n\n\nThe images of type <i>Logo</i> also have a panel, where you can edit the color settings.`,
        link: '',
        images: [
            'https://i.postimg.cc/rppnyS72/cv1.png',
            'https://i.postimg.cc/4NKM7HFF/image2.png'
        ]
    },
    'tips-profile': {
        title: 'Tips for a nice profile image',
        description: `When using a profile picture on a CV, it's important to make sure the photo is professional and appropriate for the job you are applying for. Here are a few tips for using and editing a profile picture:
        \n\n\n<b>1.</b> Dress professionally: Wear business attire in your photo to make a positive first impression.
        \n\n\n<b>2.</b> Consider the background: Consider the background of the photo and make sure it is neutral and professional.
        \n\n\n<b>3.</b> Use a high-resolution image: Make sure the photo is clear and of high quality.
        \n\n\n<b>4.</b> Crop and resize the image: Crop the image so that the consultant's face takes up most of the frame, and make sure the photo is the appropriate size for the CV.
        \n\n\n<b>5.</b> Adjust the brightness: Use the brightness slider to make the image brighter or darker. This can help to bring out details in the image and make it more visually appealing.
        \n\n\n<b>6.</b> Adjust the contrast: Use the contrast slider to increase or decrease the difference between the light and dark areas of the image. This can help to make the image appear more dynamic.
        \n\n\n<b>7.</b> Adjust the gray scale: Use the gray scale slider to increase or decrease the color saturation. For a CV it is a common use to make it completely black & white.`,
        link: '',
        images: ['https://i.postimg.cc/rppnyS72/cv1.png']
    },
    'new-account': {
        title: 'Create a new account (Manager or Consultant)',
        description: `To create a new user account, go to the <i>Users</i> module, click on <i>New User</i> and fill in the fields with the required information.\nMake sure to move the Manager switch to the correct position depending on what type of user you are creating.\n\n\nThe password will be auto-generated. If you don't change it, make sure to copy it before saving so you can share the login information to the person who's going to use the account. He/She will be able to change it from the <i>Account</i> page if needed.`,
        link: '',
        images: [
            'https://i.postimg.cc/2yXQNwpd/user2-min.png'
        ]
    },
    'edit-user': {
        title: 'Edit user data',
        description: `It is possible to edit any user's data from the <i>Users</i> module.\nHere you will see all the users, consultant, manager and admin types. By clicking one from the table, all the editing fields will appear, and if they have a profile picture, it is possible to edit it as well.\n\n\nNote that if you update the email from a consultant, make sure it's the same one on his Master CV. Otherwise, the account and the documents will no longer be linked to each other.`,
        link: '',
        images: [
            'https://i.postimg.cc/pTCQqvq6/user1-min.png'
        ]
    },
    'what-to-know-consultant-data': {
        title: 'What to know when updating consultant data',
        description: `If you update consultant information from the <i>CV Tool</i> or <i>Users</i> module, it won't be reflected in all the modules the consultant is.\n\n\nThe only field that connects the user data to the different documents is the email, so make sure that if you update it in one of the modules, you do the same in the other one involved.\n\n\n
        E.g. If you change a consultant's email from the Users module, go to the CV List and find the consultant's master CV to make the same update to the email. Otherwise, the account and the documents will no longer be linked to each other.`,
        link: '',
        images: []
    },
    'type-of-data': {
        title: 'Types of data',
        description: `Within the app, you can find different types of data.\n\n\n<b>Tools and Tech</b>\nIn this module you can upload and manage the technologies that will be available in the CV sections when creating or editing a document.\n\n\n<b>Skills</b>\n Likewise, you can see and edit the different type of skills and their fields of action in the <i>Skills</i> tab in settings.\nThis data will appear as suggestions when adding skills on a CV.\n\n\n<b>Clients</b>\nIn the Clients module, you will find a list of all the Clients or Companies uploaded to the database.\nWhen a CV is saved, all the experience data will be converted by the app to blocks of company information and saved in this section. Also, it is possible to add or edit Client data directly from here as well as manage logo images.\n\n\n<b>Buzzwords</b>\nThis particular type of data is used just as CV metadata and it helps to identify and search the CVs better.\nThere's a separate module for this in settings.`,
        link: '',
        images: []
    },
    'activity-and-statistics': {
        title: 'Activity & Statistics',
        description: `The <b>Activity</b> module is a history log that can be very useful to track all kinds of movements within the app, from attempts of logins to data flow.\nHere you can check if a change made through the system or if some item was deleted.\nAlso you have a search bar that you can use to look for a specific log.\nThe activities are discriminated by date, module and description, so it is easy to know what is it about and when it happened.\n\n\nAnother important module that you can use to check the app data flow is <b>Statistics</b>.\nThis page renders some graphics fed by activities, CVs and user data that can be used for basic analysis purposes and to understand better what's going on inside the app database.`,
        link: '',
        images: []
    },
    'common-errors': {
        title: 'Common errors',
        description: `These types of errors can appear when using the app.\nWhen creating or updating an element such as a CV or a user, there are several error handlers that prompts you to make a change before saving the data.\nIf there's an error that can't be avoided, or you feel that something is not working properly, it is always better that you make a comment to one of the app reference contacts.\n\n\nIf the app stops working in some point, it is likely to be a Server Error, try to enter again in a few minutes. If the problem persists, please submit a report or contact one of the app references for a faster resolution (all this information can be found in the <i>Help Page</i>).`,
        link: '',
        images: [
            'https://i.postimg.cc/SNqCX7zV/tr1-min.png'
        ]
    },
    'sumbit-report': {
        title: 'Submit a report',
        description: `If you run into a problem or something just feels off while using the app, you can submit a report and we will take care of it as soon as possible. If this is something that blocks you from continuing working, please contact one of the app references found in <i>Help Pages</i>.\n\n\nTo submit a report, just click on the bug icon found in the upper-right corner next to your account avatar, write a title and fill in the description field with as much detail as possible. When you're done, just hit <i>Create Report</i> and the team in charge will take care from there.`,
        link: '',
        images: [
            'https://i.postimg.cc/Kj7Tq4Cn/tr2-min.png'
        ]
    },
    'hr-info': {
        title: 'Contact Information - HR References',
        description: `<b>Nina Trobäck</b> \n nina.troback@sigma.se \n +46703361203\n\n\n
        <b>Susanne Wieslander</b>\nsusanne.wieslander@sigma.se \n+46704449787`,
        link: '',
        images: []
    },
    'development-info': {
        title: 'Contact Information - App Development',
        description: '<b>Guillermo Sotelo</b> \n guillermo.sotelo@sigma.se \n +46761274862',
        link: '',
        images: []
    },
}