export interface ButtonStyle{
    button:{
        backgroundColor: string;
        borderWidth?: number;
        borderColor?: string;
    };
    tittle:{
        color:string;
    };
   
}

export interface ButtonVariant{
    enabled:ButtonStyle;
   
    
}

export const buttonPrimary: ButtonVariant={
    enabled:{
        button:{
            backgroundColor:"#5400A8"
        },
        tittle:{ color:"white"},
    },
   
};

export const buttonOutline: ButtonVariant={
    enabled:{
        button:{
            backgroundColor:"transparent"
        },
        tittle:{ color:"black"},
    },
   
};

export const variants= {
    primary: buttonPrimary,
    outline: buttonOutline,
}