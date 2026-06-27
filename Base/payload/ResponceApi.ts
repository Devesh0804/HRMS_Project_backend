


class ResponceApi {

    status = false
    message = "";
    data = null

    constructor(status:boolean) {
        this.status=status
    }
  
    setMessage(msg: string) {
        this.message = msg
    }

    setResult(data: any, msg:string) {
        this.data = data
        this.message=msg
    }

}